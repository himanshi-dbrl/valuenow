import { Component, OnInit, Input } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-post-banner',
  templateUrl: './post-banner.component.html',
  styleUrls: ['./post-banner.component.css']
})
export class PostBannerComponent implements OnInit {
  @Input() data: any;
  constructor(public commonService: CommonHttpService) { }

  ngOnInit() {
  }

}
