import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-myworkplace',
  templateUrl: './myworkplace.component.html',
  styleUrls: ['./myworkplace.component.css']
})
export class MyworkplaceComponent implements OnInit {

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
