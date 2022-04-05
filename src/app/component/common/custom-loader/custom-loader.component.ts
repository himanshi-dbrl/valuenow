import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.css']
})
export class CustomLoaderComponent implements OnInit {
  loaderStatus: boolean = false;
  language: any = [];
  constructor(private loader: LoaderService, private commonService: CommonHttpService) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.loader.status.subscribe(status => {
      this.loaderStatus = status;
    });

  }

  ngOnInit() {
  }

}
