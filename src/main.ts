import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { Heatmap } from './app/heatmap/heatmap';

bootstrapApplication(Heatmap, {
  providers: [
    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));
