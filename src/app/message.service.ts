import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  message(msg: string) {
    console.log('MSG::', msg);
  }
}
