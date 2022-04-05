import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit {
  closeResult: string;
  forgotForm: FormGroup;
  language: any = [];
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder, private commonService: CommonHttpService, private loader: LoaderService, private alert: AlertService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Forgot Password", "forgot password", "forgot password", event.urlAfterRedirects, 4);
      }
    });
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;

      },
      err => { }
    )
  }
  submitted: boolean = false;

  formBuild() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
    })
  }

  get f() {
    return this.forgotForm.controls;
  }
  ngOnInit() {
    this.formBuild();
  }



  submit(content) {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    const url = "forgotpassword";
    const req_data = this.forgotForm.value;
    this.loader.display(true);
    this.commonService.commonPostCall(url, req_data).subscribe(data => {
      if (data.status_code == 200) {
        this.alert.success(data.message);
        this.openVerticallyCentered(content);
      } else {
        this.alert.error(data.message);
      }

      this.loader.display(false);
    }, error => {
      this.loader.display(false);
      this.alert.error(error.error.message);
    })
  }



  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // this.closeResult = result;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeDialog() {
    this.modalService.dismissAll();
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }
}
