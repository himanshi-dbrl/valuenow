import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-payment-sucess',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  language: any = [];
  paymentUpdate: boolean = false;
  constructor(private commonService: CommonHttpService, private loader: LoaderService, private alert: AlertService, private router: Router, private route: ActivatedRoute) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }

  ngOnInit() {
    this.updateStatus();
  }

  updateStatus() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      const url = `paymentUpdateStatus/${id}`;
      this.commonService.commonGetCall(url).subscribe(data => {
        this.paymentUpdate = true;
        setTimeout(() => {
          this.homeBack();
        }, 10000);
      }, error => {

      })
    }

  }

  homeBack() {
    this.router.navigate(['/home']);
  }
}
