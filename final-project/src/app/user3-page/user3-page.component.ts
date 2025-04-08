import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

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

  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.srcObject = this.stream;
        this.isPlaying = true;
        
        this.videoPlayer.nativeElement.addEventListener('playing', () => {
          this.isPlaying = true;
          this.isPaused = false;
        });
        this.videoPlayer.nativeElement.addEventListener('pause', () => {
          this.isPlaying = false;
          this.isPaused = true;
        });
      }
    } catch (error) {
      console.error('Kamera erişimi hatası:', error);
      alert('Kameraya erişim sağlanamadı. Lütfen kamera izinlerini kontrol edin.');
    }
  }

  stopVideo() {
    if (this.videoPlayer && this.stream) {
      this.videoPlayer.nativeElement.pause();
      this.stream.getTracks().forEach(track => track.stop());
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  togglePause() {
    if (this.videoPlayer && this.stream) {
      if (this.isPaused) {
        this.stream.getTracks().forEach(track => track.enabled = true);
        this.videoPlayer.nativeElement.play()
          .then(() => {
            this.isPaused = false;
            this.isPlaying = true;
          })
          .catch(error => {
            console.error('Video oynatma hatası:', error);
          });
      } else {
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
}
