import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as localforage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private subject = new BehaviorSubject<[string, any]>(['', null]);

  constructor() { }

  save() {}

  load() {}

  setItem(key: string, value: any) {
    localforage.setItem(key, value);
    this.subject.next([key, value]);
  }

  async getItem(key: string) {
    return await localforage.getItem(key);
  }

  listen<T>(key: string): Observable<T> {
    return this.subject
      .pipe(
        filter(item => item[0] === key),
        map(item => item[1])
      );
  }
}
