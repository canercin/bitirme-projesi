import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user2-page',
  templateUrl: './user2-page.component.html',
  styleUrls: ['./user2-page.component.css']
})
export class User2PageComponent implements OnInit {
  originalImagePath: string = '';
  resultImagePath: string = '';
  cancerType: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // URL'den görüntü yollarını ve kanser tipini al
    this.route.queryParams.subscribe(params => {
      this.originalImagePath = params['original_filename'];
      this.resultImagePath = params['result_filename'];
      this.cancerType = params['cancer_type'] || '';
    });
  }

  muayeneSayfasinaDon(): void {
    this.router.navigate(['/user']);
  }

  islemGoruntule(): void {
    // İşlem detaylarını görüntüleme sayfasına yönlendir
    this.router.navigate(['/user3'], {
      queryParams: {
        original_filename: this.originalImagePath,
        result_filename: this.resultImagePath
      }
    });
  }
}
