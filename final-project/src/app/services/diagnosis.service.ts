import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Diagnosis {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getDiagnoses(): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.apiUrl}/diagnosis`);
  }
} 