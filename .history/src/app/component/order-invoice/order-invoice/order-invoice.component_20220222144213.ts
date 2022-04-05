import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { url } from 'inspector';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.css']

})
export class OrderInvoiceComponent implements OnInit {
  headerData: object;
  datas: any = [];
  invoiceDetails: any = [];
  activeData: any = [];
  language: any = [];
  notFound: boolean = false;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private http: HttpClient, private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("hello");
        this
          .googleAnalyticsService
          .eventEmitter("Order Invoice", "order invoice", "order", event.urlAfterRedirects, 15);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.my_order_invoices, description: '' };
      },
      err => { }
    )

  }

  ngOnInit() {
    this.getInvoice();
  }

  encodeId(val) {
    return 'VLNW' + val;
  }

  getInvoice() {
    this.notFound = false;
    this.loader.display(true);
    const url = 'invoices';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status_code == 200) {
        this.datas = data.data;
        this.notFound = this.datas.length > 0 ? false : true;
      }
      this.loader.display(false);

    }, error => {
      this.loader.display(false);
      this.notFound = true;
      if (typeof error == 'string') {
        this.alert.info(error);
      } else {
        this.alert.error(this.language.server_not_responding);
      }

    })
  }


  generateInvoice(id) {
    const url = 'getpaymentinvoice/' + id;
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        console.log('sd',data.url);
        var url = data.url;
        var pdfName = url.split("/");
        var name = pdfName[pdfName.length - 1];
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', url);
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }, error => {

    }
    )
  }

  details(content, id, type, data) {
    this.activeData = [];
    this.activeData = data;
    const req = { id: id, type: type };
    this.loader.display(true);
    const url = 'invoiceDetails';
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status_code == 200) {
        this.modalService.open(content, { windowClass: 'modal-holder', centered: true, size: 'lg' });
        this.invoiceDetails = data.data;
        console.log(this.invoiceDetails);
      } else {
        this.alert.info(data.message);
      }
      this.loader.display(false);
    }, error => {
      if (typeof error == 'string') {
        this.alert.info(error);
      }
      this.loader.display(false);
      this.router.navigate(['order-invoice/list']);
    })
  }

}
