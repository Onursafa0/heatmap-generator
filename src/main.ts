import { bootstrapApplication } from '@angular/platform-browser';
import { Heatmap } from './app/heatmap/heatmap';

bootstrapApplication(Heatmap, {
  providers: []
}).catch(err => console.error(err));
