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

  onNavigate(url){
    let urls: string = '';
    if (!/^http[s]?:\/\//.test(url)) {
        urls += 'http://';
    }
    
    urls += url;
    
    //this.router.navigateByUrl("https://www.google.com");
    window.open(urls, '_blank');
  }

}
