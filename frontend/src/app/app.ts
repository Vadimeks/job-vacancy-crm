import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Дадаем для працы з тэкставым полем
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // 2. Не забываем дадаць сюды
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  vacancies: any[] = [];
  rawText: string = ''; // 3. Зменная для тэксту з чата

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.vacancyService.getVacancies().subscribe({
      next: (data: any[]) => {
        // Сартуем ад новых да старых па даце стварэння
        this.vacancies = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log('Дадзеныя атрыманы і адсартаваны');
      },
      error: (err: any) => console.error('Памылка загрузкі:', err),
    });
  }

  // 4. Метад для кнопкі "Апрацаваць"
  processText(): void {
    if (!this.rawText.trim()) return;

    this.vacancyService.createVacancyAuto(this.rawText).subscribe({
      next: (res) => {
        console.log('Вакансія створана:', res);
        this.rawText = ''; // Ачышчаем поле пасля поспеху
        this.loadVacancies(); // Асцерагальна абнаўляем спіс
        alert('Вакансія апрацавана і адпраўлена ў Telegram!');
      },
      error: (err) => {
        console.error('Памылка агента:', err);
        alert('Не ўдалося апрацаваць тэкст');
      },
    });
  }
}
