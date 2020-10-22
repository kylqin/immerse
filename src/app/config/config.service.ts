import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// import * as localforage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private subject = new BehaviorSubject<[string, any]>(['', null]);

  constructor() { }

  save() {}

  load() {}

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
    this.subject.next([key, value]);
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  listen<T>(key: string): Observable<T> {
    return this.subject
      .pipe(
        filter(item => item[0] === key),
        map(item => item[1])
      );
  }

  getReadingSettings() {
    return {
      theme: this.getItem('reader.theme'),
      pageMode: this.getItem('reader.pageMode'),
      pageScale: this.getItem('reader.pageScale'),
      fontFamily: this.getItem('reader.fontFamily'),
      fontSize: this.getItem('reader.fontSize'),
      lineHeight: this.getItem('reader.lineHeight'),
    };
  }
}
