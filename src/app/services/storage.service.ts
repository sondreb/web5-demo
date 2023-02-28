import { Injectable } from '@angular/core';
import {
  Dwn,
  DataStream,
  DidKeyResolver,
  Jws,
  RecordsWrite,
  RecordsQuery,
} from '@tbd54566975/dwn-sdk-js';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  dwn!: Dwn;

  constructor() {}

  async initialize() {
    this.dwn = await Dwn.create();
  }
}
