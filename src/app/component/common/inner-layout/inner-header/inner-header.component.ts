import { Component, OnInit, Input } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';


@Component({
  selector: 'app-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.css']
})
export class InnerHeaderComponent implements OnInit {

  @Input() headerData: any;
  userData: any = [];
  language: any = [];
  constructor(private commonService: CommonHttpService) {
    this.userData = this.commonService.getUserData();
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }

  ngOnInit() {
  }

  setUserType(type) {
    const url = `changerole`;
    const data = { role: type };
    this.commonService.commonPostCall(url, data).subscribe(data => {
      this.userDataReset(type);
    }, error => {
      this.userDataReset(type);
    })
  }


  userDataReset(type) {
    this.userData['type'] = type;
    this.commonService.shareUserData(this.userData);
    this.commonService.setUserData(JSON.stringify(this.userData));
    location.reload();
  }

}


