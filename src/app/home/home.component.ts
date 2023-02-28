import { Component } from '@angular/core';
import {
  DataStream,
  DidKeyResolver,
  Jws,
  RecordsWrite,
} from '@tbd54566975/dwn-sdk-js';
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
    this.app.didKey = didKey;

    console.log('DID Key:', didKey);
    // this.app.did = didKey;
  }

  async createSigner() {
    const signatureMaterial = Jws.createSignatureInput(this.app.didKey);

    const data = new Uint8Array(32);
    window.crypto.getRandomValues(data);

    const query = await RecordsWrite.create({
      data,
      dataFormat: 'application/json',
      published: true,
      protocol: 'yeeter',
      schema: 'yeeter/post',
      authorizationSignatureInput: signatureMaterial,
    });

    console.log('Query:', query);

    const dataStream = DataStream.fromBytes(data);

    const result = await this.storage.dwn.processMessage(
      this.app.didKey.did,
      query.toJSON(),
      dataStream
    );

    console.log('Result:', result);
  }

  async callExtension() {
    const win = globalThis as any;

    const result = await win.web5.dwn.processMessage({
      method: 'RecordsQuery',
      message: {
        filter: {
          schema: 'http://some-schema-registry.org/todo',
        },
        dateSort: 'createdAscending',
      },
    });
  }

  saveToWebNode(item: any) {
    console.log('Save:', item);
  }
}
