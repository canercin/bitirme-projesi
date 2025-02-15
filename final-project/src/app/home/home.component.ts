import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('webcam') webcam: any; // Webcam bileşenini referans alıyoruz
  trigger: Subject<void> = new Subject();
  previewImage: any = '';
  btnLabel: string = 'Capture Image';
  public btnVisible: boolean = true;
  public cameraVisible: boolean = false; // Kamera görüntüsünü kontrol eden değişken
  public status: string = ''; // Kamera durumu için mesaj
  selectedFile: File | null = null;
  uploadUrl = 'http://localhost:5000/upload';  // Flask backend URL'i
 

  // Webcam tetikleyicisini döndürüyoruz
  public get triggerObservable() {
    return this.trigger.asObservable();
  }

  // Fotoğraf çekildiğinde çalışacak fonksiyon
  public handleImage(webcamImage: WebcamImage): void {
    console.log('Received webcam image', webcamImage);
    this.previewImage = webcamImage.imageAsDataUrl;
    this.status = 'Image captured successfully!';
    this.btnLabel = 'Re Capture Image'; // Buton metnini değiştiriyoruz
  }

  public uploadCapturedImage(): void {
    const imageData = this.previewImage.split(',')[1]; // Base64 string'in veri kısmını alıyoruz
    const byteCharacters = atob(imageData); // Base64'i binary formata çeviriyoruz
    const byteArrays = new Uint8Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
  
    // Blob oluşturma
    const blob = new Blob([byteArrays], { type: 'image/jpeg' });
  
    // FormData oluşturma ve Blob'u ekleme
    const formData = new FormData();
    formData.append('image', blob, 'captured-image.jpg');
  
    // Backend'e gönderme
    this.http.post(this.uploadUrl, formData).subscribe(
      (response) => {
        this.status = 'Captured image uploaded successfully!';
        console.log(response);
      },
      (error) => {
        this.status = 'Error uploading captured image';
        console.error(error);
      }
    );
  }

  // Kamera izni kontrolü ve başlatma
  public checkPermission(): void {
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then((stream) => {
      this.status = 'Camera access granted!';
      this.cameraVisible = true; // Kamera görüntüsünü görünür yapıyoruz
      this.btnVisible = false; // Kamera butonunu gizliyoruz
    }).catch((error) => {
      console.log(error);
      this.status = 'Permission denied or camera error!';
    });
  }

  // Fotoğraf çekmek için tetikleyici
  public captureImage(): void {
    this.trigger.next();
  }

  // Kamera görüntüsünü kapatma
  public closeCamera(): void {
    this.cameraVisible = false; // Kamera görüntüsünü gizliyoruz
    this.btnVisible = true; // Kamera butonunu görünür yapıyoruz
    this.status = ''; // Kamera durumu mesajını temizliyoruz
  }
  
  constructor(private http: HttpClient) {}  
   // Dosya seçildiğinde çağrılacak fonksiyon
   onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Fotoğrafı backend'e gönderme
  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post(this.uploadUrl, formData).subscribe(
        (response) => {
          this.status = 'File uploaded successfully!';
          console.log(response);
        },
        (error) => {
          this.status = 'Error uploading file';
          console.error(error);
        }
      );
    } else {
      this.status = 'Please select a file first!';
    }
  }
}

