import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-left-banner',
  templateUrl: './left-banner.component.html',
  styleUrls: ['./left-banner.component.css']
})
export class LeftBannerComponent implements OnInit {
  data: any = [];
  constructor(private commanService: CommonHttpService) { }

  ngOnInit() {
    this.getBanner('left');
  }

  getBanner(type) {
    const url = `getBanner/${type}`;
    this.commanService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.data = data.data;
        console.log('this',this.data);
      } else {
        this.data = [];
      }
    }, error => {
      this.data = [];
    })
  }

  onNavigate(url){

    //this.router.navigateByUrl("https://www.google.com");
    window.open("https://www.google.com", '_blank');
  }
}
