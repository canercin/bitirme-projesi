import { Component, OnInit } from '@angular/core';
import { ExaminationService } from '../services/examination.service';
import { Examination } from '../services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {
  examinations: Examination[] = [];
  filteredExaminations: Examination[] = [];
  loading: boolean = true;
  error: string | null = null;
  isSidebarOpen: boolean = false;
  searchTerm: string = '';

  constructor(
    private examinationService: ExaminationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExaminations();
  }

  loadExaminations(): void {
    this.loading = true;
    this.error = null;
    
    this.examinationService.getAllExaminations().subscribe({
      next: (data) => {
        this.examinations = data;
        this.filteredExaminations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading examinations:', error);
        this.error = 'Muayene sonuçları yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterExaminations(): void {
    if (!this.searchTerm.trim()) {
      this.filteredExaminations = this.examinations;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredExaminations = this.examinations.filter(exam => 
        exam.diagnosis.name.toLowerCase().includes(searchTermLower)
      );
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
}
