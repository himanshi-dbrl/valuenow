import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  headerData: object = { title: 'My Order', description: '' };
  data: any = [];
  notFound: boolean = false;
  constructor(private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const type = this.route.snapshot.params['type'];
    this.getDetails(id, type);
  }

  getDetails(id, type) {

    const req = { id: id, type: type };
    this.loader.display(true);
    const url = 'invoiceDetails';
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status_code == 200) {
        this.data = data.data;
      } else {

      }
      this.loader.display(false);
    }, error => {
      this.notFound = true;
      if (typeof error == 'string') {
        this.alert.info(error);
      }
      this.loader.display(false);
      this.router.navigate(['order-invoice/list']);
    })
  }

}
