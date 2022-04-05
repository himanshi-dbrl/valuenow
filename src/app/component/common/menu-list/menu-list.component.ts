import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  userData: any;
  language: any = [];
  constructor(private commonService: CommonHttpService) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.commonService.userData.subscribe(data => {
      this.userData = data;
    });

  }

  ngOnInit() {
  }

}
