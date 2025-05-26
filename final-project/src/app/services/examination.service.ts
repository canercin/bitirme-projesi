import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Examination } from './patient.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExaminationService {
  private apiUrl = environment.apiUrl + '/examination';

  constructor(private http: HttpClient) { }

  getAllExaminations(): Observable<Examination[]> {
    return this.http.get<Examination[]>(this.apiUrl);
  }

  getExaminationById(id: string): Observable<Examination> {
    return this.http.get<Examination>(`${this.apiUrl}/${id}`);
  }

  createExamination(originalImage: File, patientID: string, diagnosisID: string): Observable<any> {
    const formData = new FormData();
    formData.append('originalImage', originalImage);
    formData.append('patientID', patientID);
    formData.append('diagnosisID', diagnosisID);

    return this.http.post(this.apiUrl, formData);
  }
} 