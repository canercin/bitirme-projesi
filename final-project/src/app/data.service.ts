import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:5000/api'; // Flask backend URL'i

  constructor(private http: HttpClient) {}

  // Backend'den veri almak için GET isteği
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  // Backend'e veri göndermek için POST isteği
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, data);
  }
}
