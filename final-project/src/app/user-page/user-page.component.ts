import { Component, ViewChild, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PatientService, Patient } from '../services/patient.service';
import { DiagnosisService, Diagnosis } from '../services/diagnosis.service';
import { ExaminationService } from '../services/examination.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  @ViewChild('webcam') webcam: any; // Webcam bileşenini referans alıyoruz
  trigger: Subject<void> = new Subject();
  previewImage: any = '';
  btnLabel: string = 'Capture Image';
  public btnVisible: boolean = true;
  public cameraVisible: boolean = false; // Kamera görüntüsünü kontrol eden değişken
  public status: string = ''; // Kamera durumu için mesaj
  selectedFile: File | null = null;
  uploadUrl = 'http://localhost:5000/upload';  // Flask backend URL'i
  isSidebarOpen: boolean = false;
  selectedImageUrl: string | null = null;
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  diagnoses: Diagnosis[] = [];
  selectedDiagnosis: string = '';
  selectedPatientId: string = '';

  // Webcam tetikleyicisini döndürüyoruz
  public get triggerObservable(): Observable<void> {
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
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private patientService: PatientService,
    private diagnosisService: DiagnosisService,
    private examinationService: ExaminationService
  ) {}  
   // Dosya seçildiğinde çağrılacak fonksiyon
   onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Fotoğrafı backend'e gönderme
  onUpload(): void {
    if (this.selectedFile && this.selectedPatientId && this.selectedDiagnosis) {
      this.examinationService.createExamination(
        this.selectedFile,
        this.selectedPatientId,
        this.selectedDiagnosis
      ).subscribe({
        next: (response) => {
          console.log('Examination created successfully:', response);
          // Handle success - maybe show a success message or redirect
          if (response.result?.hasCancer) {
            this.router.navigate(['/user2'], {
              queryParams: {
                original_filename: response.result.originalImagePath,
                result_filename: response.result.resultImagePath
              }
            });
          } else {
            alert('Kanser tespit edilmedi. Lütfen başka bir görüntü deneyin.');
          }
        },
        error: (error) => {
          console.error('Error creating examination:', error);
          alert('Muayene oluşturulurken bir hata oluştu.');
        }
      });
    } else {
      alert('Lütfen bir dosya seçin, hasta seçin ve tanı seçin.');
    }
  }

  // Sidebar'ı açıp kapatan fonksiyon
  toggleSidebar(): void {
    console.log('Sidebar toggle edildi');
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDiagnoses();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
      }
    });
  }

  loadDiagnoses(): void {
    this.diagnosisService.getDiagnoses().subscribe({
      next: (data: Diagnosis[]) => {
        this.diagnoses = data;
      },
      error: (error: any) => {
        console.error('Error loading diagnoses:', error);
      }
    });
  }

  filterPatients(): void {
    if (!this.searchTerm) {
      this.filteredPatients = this.patients;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchTermLower) ||
      patient.lastName.toLowerCase().includes(searchTermLower) ||
      patient.id.toLowerCase().includes(searchTermLower)
    );
  }

  onDiagnosisChange(event: any): void {
    this.selectedDiagnosis = event.target.value;
    console.log('Selected diagnosis:', this.selectedDiagnosis);
  }

  onPatientSelect(patientId: string): void {
    this.selectedPatientId = patientId;
    console.log('Selected patient:', patientId);
  }

  logout(): void {
    // Local storage'daki tüm verileri temizle
    localStorage.clear();
    // Ana sayfaya yönlendir
    this.router.navigate(['/']);
  }

  yeniMuayene(): void {
    this.selectedFile = null;
    this.selectedImageUrl = null;
    this.selectedPatientId = '';
    this.selectedDiagnosis = '';
    this.previewImage = '';
    // Sayfayı yenile
    window.location.reload();
  }
}


