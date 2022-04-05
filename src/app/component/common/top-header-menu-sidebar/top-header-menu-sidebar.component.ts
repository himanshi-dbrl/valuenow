import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-top-header-menu-sidebar',
  templateUrl: './top-header-menu-sidebar.component.html',
  styleUrls: ['./top-header-menu-sidebar.component.css']
})
export class TopHeaderMenuSidebarComponent implements OnInit {
  language: any = [];
  constructor(private commonService: CommonHttpService) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }

  ngOnInit() {
  }

}
