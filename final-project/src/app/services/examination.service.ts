import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExaminationService {
  private apiUrl = 'http://localhost:8080/api/examination';

  constructor(private http: HttpClient) { }

  createExamination(originalImage: File, patientID: string, diagnosisID: string): Observable<any> {
    const formData = new FormData();
    formData.append('originalImage', originalImage);
    formData.append('patientID', patientID);
    formData.append('diagnosisID', diagnosisID);

    return this.http.post(this.apiUrl, formData);
  }
} 