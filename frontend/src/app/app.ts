import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  vacancies: any[] = [];
  rawText: string = '';

  // Дадаем для пошуку
  searchText: string = '';

  pagedVacancies: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  editingId: string | null = null;

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.loadVacancies();
  }

  // Гетэр для фільтрацыі: ён бярэ альбо адфільтраваныя вакансіі, альбо звычайную старонку
  get filteredVacancies() {
    if (!this.searchText.trim()) {
      return this.pagedVacancies;
    }
    const term = this.searchText.toLowerCase();
    return this.vacancies.filter(
      (v) =>
        v.title?.toLowerCase().includes(term) ||
        v.location?.toLowerCase().includes(term) ||
        v.description?.toLowerCase().includes(term)
    );
  }

  loadVacancies(): void {
    this.vacancyService.getVacancies().subscribe({
      next: (data: any[]) => {
        this.vacancies = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.calculatePagination();
      },
      error: (err: any) => console.error('Памылка загрузкі:', err),
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.vacancies.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedVacancies = this.vacancies.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
      window.scrollTo(0, 0);
    }
  }

  processText(): void {
    if (!this.rawText.trim()) return;
    this.vacancyService.createVacancyAuto(this.rawText).subscribe({
      next: (res) => {
        this.rawText = '';
        this.currentPage = 1;
        this.loadVacancies();
        alert('Вакансія апрацавана!');
      },
      error: (err) => {
        console.error('Памылка агента:', err);
        alert('Не ўдалося апрацаваць тэкст');
      },
    });
  }

  deleteVacancy(id: string): void {
    if (confirm('Вы ўпэўнены?')) {
      this.vacancyService.deleteVacancy(id).subscribe({
        next: () => this.loadVacancies(),
        error: (err: any) => console.error('Памылка:', err),
      });
    }
  }

  editVacancy(id: string): void {
    this.editingId = id;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.loadVacancies();
  }

  saveVacancy(vacancy: any): void {
    this.vacancyService.updateVacancy(vacancy._id, vacancy).subscribe({
      next: () => {
        this.editingId = null;
        alert('Захавана!');
      },
      error: (err: any) => alert('Памылка пры захаванні'),
    });
  }
}
