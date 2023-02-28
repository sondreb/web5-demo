import { Component } from '@angular/core';
import { DidKeyResolver } from '@tbd54566975/dwn-sdk-js';
import { ApplicationService } from '../services/application.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  items = [
    {
      title: 'Shiba Inu',
      abstract: 'Dog Breed',
      content: `The Shiba Inu is the smallest of the six original and distinct spitz
    breeds of dog from Japan. A small, agile dog that copes very well with
    mountainous terrain, the Shiba Inu was originally bred for hunting.`,
    },
  ];

  constructor(
    private storage: StorageService,
    public app: ApplicationService
  ) {}

  async generateDid() {
    const didKey = await DidKeyResolver.generate();
    console.log('DID Key:', didKey);
    // this.app.did = didKey;
  }

  saveToWebNode(item: any) {
    console.log('Save:', item);
  }
}
