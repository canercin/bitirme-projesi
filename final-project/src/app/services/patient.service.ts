import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Result {
  id: string;
  hasCancer: boolean;
  originalImagePath: string;
  resultImagePath: string;
}

export interface Diagnosis {
  id: string;
  name: string;
  type: number;
}

export interface Examination {
  id: string;
  date: string | null;
  result: Result | null;
  diagnosis: Diagnosis;
}

export interface Authority {
  authority: string;
}

export interface Doctor {
  id: string;
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  examinations: Examination[];
  enabled: boolean;
  authorities: Authority[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface Patient {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  examinations: Examination[];
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patient`);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patient/${id}`);
  }
} 