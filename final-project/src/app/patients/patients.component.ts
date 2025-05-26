import { Component, OnInit } from '@angular/core';
import { PatientService, Patient } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  userInfo: any;
  selectedPatient: Patient | null = null;
  private modal: any;
  isSidebarOpen: boolean = false;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    if (!this.userInfo) {
      this.router.navigate(['/sign-in']);
      return;
    }
    this.loadPatients();
    this.initializeModal();
  }

  private initializeModal(): void {
    this.modal = new bootstrap.Modal(document.getElementById('patientDetailsModal'), {
      keyboard: true,
      backdrop: true
    });
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;
    
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.error = 'Hasta listesi yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterPatients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredPatients = this.patients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchTermLower) ||
        patient.lastName.toLowerCase().includes(searchTermLower)
      );
    }
  }

  openPatientDetails(patient: Patient): void {
    this.selectedPatient = patient;
    this.modal?.show();
  }

  closeModal(): void {
    this.modal?.hide();
    this.selectedPatient = null;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
} 