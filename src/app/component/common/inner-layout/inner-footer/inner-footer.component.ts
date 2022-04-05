import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-inner-footer',
  templateUrl: './../../footer/footer.component.html',
  styleUrls: ['./../../footer/footer.component.css']
})
export class InnerFooterComponent implements OnInit {

  language: any = [];
  currentYear:any= new Date().getFullYear();
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
