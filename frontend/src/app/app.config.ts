import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // дадаў ZoneChangeDetection
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Гэта вельмі важна для сувязі з бэкендам

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Дадаем для стабільнасці
    provideRouter(routes),
    provideHttpClient(), // Гэта дазваляе Angular карыстацца інтэрнэтам
  ],
};
