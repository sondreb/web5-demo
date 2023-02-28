import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.storage.initialize();
  }

  title = 'web5-demo';
}
