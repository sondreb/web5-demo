import { Component } from '@angular/core';
import {
  Dwn,
  DataStream,
  DidKeyResolver,
  Jws,
  RecordsWrite,
  RecordsQuery,
  ProtocolDefinition,
  ProtocolsConfigure,
  RecordsRead,
} from '@tbd54566975/dwn-sdk-js';
import { ApplicationService } from '../services/application.service';
import { StorageService } from '../services/storage.service';
import { v4 as uuidv4 } from 'uuid';

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

  async connect() {
    const dwn = await Dwn.create();
    const didKey = await DidKeyResolver.generate(); // generate a did:key DID
    const signatureMaterial = Jws.createSignatureInput(didKey);
    // const data = randomBytes(32); // in node.js
    // or in web
    const data = new Uint8Array(32);
    window.crypto.getRandomValues(data);

    debugger;

    const protocol = 'notes-protocol';

    const query = await RecordsWrite.create({
      data,
      dataFormat: 'application/json',
      published: true,
      protocol: protocol,
      schema: 'notes',
      authorizationSignatureInput: signatureMaterial,
    });

    debugger;

    // write a protocol definition with an allow-anyone rule

    const protocolDefinition: ProtocolDefinition = {
      labels: {
        notes: {
          schema: 'notes',
        },
      },
      records: {
        notes: {
          allow: {
            anyone: {
              to: ['write'],
            },
          },
        },
      },
    };

    // const alice = await TestDataGenerator.generatePersona();
    // const bob = await TestDataGenerator.generatePersona();

    const protocolsConfigure = await ProtocolsConfigure.create({
      dateCreated: new Date().toString(),
      protocol: protocol,
      definition: protocolDefinition,
      authorizationSignatureInput: signatureMaterial,
    });

    // const protocolsConfig = await TestDataGenerator.generateProtocolsConfigure({
    //   requester: didKey.did,
    //   protocol,
    //   protocolDefinition,
    // });

    // setting up a stub DID resolver
    // TestStubGenerator.stubDidResolver(didResolver, [alice, bob]);

    debugger;

    const dataStream2 = undefined;

    const protocolWriteReply = await dwn.processMessage(
      didKey.did,
      protocolsConfigure.toJSON(),
      dataStream2
    );

    console.log(protocolWriteReply);

    const dataStream = DataStream.fromBytes(data);
    const result = await dwn.processMessage(
      didKey.did,
      query.toJSON(),
      dataStream
    );

    // const readQuery = await RecordsRead.create({
    //   data,
    //   dataFormat: 'application/json',
    //   published: true,
    //   protocol: protocol,
    //   schema: 'notes',
    //   authorizationSignatureInput: signatureMaterial,
    // });

    const recordsQuery = await RecordsQuery.create({
      filter: { schema: 'notes' },
      dateCreated: new Date().toString(),
      authorizationSignatureInput: signatureMaterial,
    });

    const queryResult = await dwn.processMessage(
      didKey.did,
      recordsQuery.toJSON()
    );

    console.log(queryResult);

    const recordsRead = await RecordsRead.create({
      // recordId: 'bafyreifqktkmvligshhqldlowmqms656zswhggkqu7sv7oekxdtcvatmly',
      recordId: query.message.recordId,
      authorizationSignatureInput: signatureMaterial,
    });

    const readReply = await dwn.processMessage(didKey.did, recordsRead.message);
    console.log(readReply);

    // const queryQuery = await RecordsQuery.create({
    //   data,
    //   dataFormat: 'application/json',
    //   published: true,
    //   protocol: protocol,
    //   schema: 'notes',
    //   authorizationSignatureInput: signatureMaterial,
    // });
  }

  async callExtension() {
    const win = globalThis as any;

    // const result = await win.web5.dwn.processMessage({
    //   method: 'RecordsQuery',
    //   message: {
    //     filter: {
    //       schema: 'http://some-schema-registry.org/todo',
    //     },
    //     dateSort: 'createdAscending',
    //   },
    // });

    // console.log(result);
    // if (result.status.code !== 200) {
    //   console.error(
    //     'Failed to fetch todos from DWN. check console for error:',
    //     result
    //   );
    //   return;
    // }

    const todoData = {
      completed: false,
      description: 'Music',
    };

    console.log('Sending process message to extension...', todoData);

    // record is the DWeb message written to the DWN
    // const { record, result } = await win.web5.dwn.processMessage({
    //   method: 'RecordsWrite',
    //   data: todoData,
    //   message: {
    //     schema: 'http://some-schema-registry.org/todo',
    //     dataFormat: 'application/json',
    //   },
    // });

    const result = await win.web5.dwn.processMessage({
      method: 'RecordsQuery',
      options: {
        dataFormat: 'application/json',
      },
      message: {
        filter: {
          schema: 'http://some-schema-registry.org/todo',
        },
        dateSort: 'createdAscending',
      },
    });

    // const { record, result } = await win.web5.dwn.processMessage({
    //   method: 'RecordsWrite',
    //   options: {
    //     dataFormat: 'application/json',
    //   },
    //   data: {
    //     id: uuidv4(),
    //     description: 'Music',
    //     completed: false,
    //   },
    // });

    console.log('Completed calling extension.');
    console.log(result);

    // const result = await win.web5.dwn.processMessage({
    //   method: 'RecordsQuery',
    //   message: {
    //     filter: {
    //       schema: 'http://some-schema-registry.org/todo',
    //     },
    //     dateSort: 'createdAscending',
    //   },
    // });
  }

  writeToDWN() {
    const win = globalThis as any;
    win.web5.dwn.processMessage({
      method: 'CollectionsWrite',
      data: {
        id: uuidv4(),
        description: 'Music',
        completed: false,
      },
    });
  }

  saveToWebNode(item: any) {
    console.log('Save:', item);
  }

  async supportedDidMethods() {
    const win = globalThis as any;
    const methods = await win.web5.did.supportedMethods();
    console.log('Methods:', methods);
  }

  async requestAccess() {
    const win = globalThis as any;
    const { isAllowed } = await win.web5.dwn.requestAccess();

    if (!isAllowed) {
      console.error('Permission not given!');
      return;
    }

    console.log('Permission granted!');
  }
}
