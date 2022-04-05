import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {
  @Input() myDropdownClass: any;
  closeResult: string;
  deleteConfirmationDialog: any;
  userData: any = [];
  language: any = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    public authService: AuthService,
    private commonService: CommonHttpService,
    private alert: AlertService,
    private loader: LoaderService
  ) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.userData = this.commonService.getUserData();
    this.commonService.userData.subscribe(data => {
      if (data != undefined || data != {}) {
        this.userData = data;
      }
    });
  }


  signOut(): void {
    this.closeDialog();
    this.commonService.deleteLocalConfig();
    this.router.navigate(["login"]);
  }

  closeDialog() {
    this.modalService.dismissAll();
  }

  ngOnInit() {
  }

  subMenu(id) {
    document.getElementById(id).classList.toggle("show");
  }


  setUrl() {
    let gender = this.userData.gender == 2 ? 'female' : 'male';
    return this.userData.image != null ? this.commonService.siteUrl() + this.userData.image : `./assets/images/${gender}.png`;
  }

  fileUpload(file: FileList) {
    const formData = new FormData();
    const url = "changeprofilepicture";
    if (file) {
      for (let index = 0; index < file.length; index++) {
        formData.append('profile_picture', file[index], file[index].name);
        this.loader.display(true);
        this.commonService.commonPostCall(url, formData).subscribe(data => {
          this.loader.display(false);
          if (data.status == 200) {
            const datas = data.data;
            this.userData = datas;
            this.commonService.shareUserData(datas);
            const userData = JSON.stringify(datas);
            this.commonService.setUserData(userData);
            this.alert.success(data.message);
            this.closeDialog();
          } else {
            this.alert.info(data.message);
          }
        }, error => {
          this.loader.display(false);
          this.alert.error(error.error.message);
        })
      }

    }
  }

  deleteProfilepic() {
    const url = 'deleteUserProfile';
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        var data = this.userData;
        data['image'] = null;
        this.commonService.shareUserData(data);
        const userData = JSON.stringify(data);
        this.commonService.setUserData(userData)
        this.alert.success(data.message);
        this.deleteConfirmationDialog.close();
      } else {
        this.alert.warning(data.message);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
    })

  }

  deleteImagedialogClose() {
    this.deleteConfirmationDialog.close();
  }



  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result} `;
      // this.closeResult = result;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)} `;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason} `;
    }
  }

  openConfirmationDialog(content) {
    this.deleteConfirmationDialog = this.modalService.open(content, { size: 'sm', centered: true });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: 'sm', windowClass: 'modal-holder', centered: true });
  }


}
