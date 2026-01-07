import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Пераканайся, што шлях ніжэй дакладны!
// Калі файл ляжыць проста ў app, прыбяры /services/
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Указваем, што гэта масіў любога тыпу (any[])
  vacancies: any[] = [];

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.vacancyService.getVacancies().subscribe({
      // Дадаем тып : any для data і err, каб TypeScript не сварыўся
      next: (data: any[]) => {
        this.vacancies = data;
        console.log('Дадзеныя атрыманы:', data);
      },
      error: (err: any) => {
        console.error('Памылка:', err);
      },
    });
  }
}
