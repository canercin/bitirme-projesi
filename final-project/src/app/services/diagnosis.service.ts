import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Diagnosis {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDiagnoses(): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.apiUrl}/diagnosis`);
  }
} 