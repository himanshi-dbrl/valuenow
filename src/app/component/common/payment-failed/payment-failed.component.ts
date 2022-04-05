import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {

  language: any = [];
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
      const url = `paymentDecline/${id}`;
      this.commonService.commonDeleteWidthIdCall(url).subscribe(data => {

      }, error => {

      })
    }
    setTimeout(() => {
      this.homeBack();
    }, 10000);

  }

  homeBack() {
    this.router.navigate(['/home']);
  }

}
