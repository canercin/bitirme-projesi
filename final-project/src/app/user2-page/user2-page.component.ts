import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user2-page',
  templateUrl: './user2-page.component.html',
  styleUrls: ['./user2-page.component.css']
})
export class User2PageComponent implements OnInit {
  originalImagePath: string = '';
  resultImagePath: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // URL'den görüntü yollarını al
    this.route.queryParams.subscribe(params => {
      this.originalImagePath = params['original_filename'];
      this.resultImagePath = params['result_filename'];
    });
  }
}
