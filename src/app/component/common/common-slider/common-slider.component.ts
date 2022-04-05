import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-slider',
  templateUrl: './common-slider.component.html',
  styleUrls: ['./common-slider.component.css']
})
export class CommonSliderComponent implements OnInit {
  @Input() images: any;
  constructor() { }

  ngOnInit() {
  }

}
