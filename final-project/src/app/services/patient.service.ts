import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Result {
  id: string;
  date: string;
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
  date: string;
  result: Result;
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
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  doctors: Doctor[];
  diagnoses: Diagnosis[];
  examinations: Examination[];
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patient';

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }
} 