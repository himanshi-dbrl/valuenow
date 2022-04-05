import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-mybusiness',
  templateUrl: './mybusiness.component.html',
  styleUrls: ['./mybusiness.component.css']
})
export class MybusinessComponent implements OnInit {

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
