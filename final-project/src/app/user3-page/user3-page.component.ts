import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExaminationService } from '../services/examination.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user3-page',
  templateUrl: './user3-page.component.html',
  styleUrls: ['./user3-page.component.css']
})
export class User3PageComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  isPaused: boolean = false;
  isPlaying: boolean = false;
  stream: MediaStream | null = null;
  isProcessStarted: boolean = false;
  gcodeFilename: string = '';

  constructor(
    private router: Router,
    private examinationService: ExaminationService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.gcodeFilename = params['original_filename'] || '';
    });
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.srcObject = this.stream;
        this.isPlaying = true;
        this.isPaused = false;
      }
    } catch (error) {
      console.error('Kamera erişimi hatası:', error);
      alert('Kameraya erişim sağlanamadı. Lütfen kamera izinlerini kontrol edin.');
    }
  }

  async ngAfterViewInit() {
    await this.startCamera();
  }

  stopVideo() {
    // Sadece işlemi durdur API isteği gönder, kamera akışını durdurma
    this.http.get('http://localhost:8081/api/gcode/cancel', {}).subscribe({
      next: () => {},
      error: (err) => { console.error('Cancel error:', err); }
    });
    // Kamera akışı devam etsin, video durmasın
    this.isPlaying = true;
    this.isPaused = false;
  }

  async togglePause() {
    if (this.isPaused) {
      // Devam Et: API isteği gönder
      this.http.get('http://localhost:8081/api/gcode/resume', {}).subscribe({
        next: () => {},
        error: (err) => { console.error('Resume error:', err); }
      });
      // Kamera akışı zaten devam ediyor, ekstra işlem yok
      this.isPaused = false;
      this.isPlaying = true;
    } else {
      // Duraklat: API isteği gönder
      this.http.get('http://localhost:8081/api/gcode/pause', {}).subscribe({
        next: () => {},
        error: (err) => { console.error('Pause error:', err); }
      });
      // Kamera akışı devam etsin, video durmasın
      this.isPaused = true;
      this.isPlaying = false;
    }
  }

  ngOnDestroy() {
    // Sadece sayfa kapanırken kamera akışını durdur
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  muayeneSayfasinaDon(): void {
    this.examinationService.getExaminationById('patient').subscribe({
      next: (response) => {
        this.router.navigate(['/user']);
      },
      error: (error) => {
        console.error('API isteği hatası:', error);
        this.router.navigate(['/user']);
      }
    });
  }

  startProcess() {
    this.isProcessStarted = true;
    if (this.gcodeFilename) {
      const url = `http://localhost:8081/api/gcode/process/${this.gcodeFilename}`;
      this.http.get(url, {}).subscribe({
        next: () => {},
        error: (err) => { console.error('Process start error:', err); }
      });
    } else {
      console.error('No gcode filename provided in query params.');
    }
  }
}
