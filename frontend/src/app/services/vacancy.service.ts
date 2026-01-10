import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  private apiUrl = 'http://localhost:3000/api/vacancies';

  constructor(private http: HttpClient) {}

  // Атрымаць усе вакансіі
  getVacancies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Аўтаматычнае стварэнне праз Агента
  createVacancyAuto(rawText: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auto`, { rawText });
  }
}
