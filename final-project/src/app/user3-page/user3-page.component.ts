import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExaminationService } from '../services/examination.service';

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

  constructor(
    private router: Router,
    private examinationService: ExaminationService
  ) {}

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
    if (this.videoPlayer && this.stream) {
      this.videoPlayer.nativeElement.pause();
      this.stream.getTracks().forEach(track => track.stop());
      this.isPlaying = false;
      this.isPaused = false;
      this.stream = null;
    }
  }

  async togglePause() {
    if (this.isPaused) {
      if (!this.stream) {
        await this.startCamera();
      } else {
        this.stream.getTracks().forEach(track => track.enabled = true);
        this.videoPlayer.nativeElement.play()
          .then(() => {
            this.isPaused = false;
            this.isPlaying = true;
          })
          .catch(error => {
            console.error('Video oynatma hatası:', error);
          });
      }
    } else {
      if (this.videoPlayer && this.stream) {
        this.stream.getTracks().forEach(track => track.enabled = false);
        this.videoPlayer.nativeElement.pause();
        this.isPaused = true;
        this.isPlaying = false;
      }
    }
  }

  ngOnDestroy() {
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
}
