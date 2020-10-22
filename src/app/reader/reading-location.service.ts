import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadingLocationService {

  constructor() { }

  public recordCfi(bookKey: string, cfi: string, percentage: number) {
    const json = localStorage.getItem('readingLocation');
    const obj = JSON.parse(json!) || {};
    obj[bookKey] = { cfi, percentage };
    localStorage.setItem('readingLocation', JSON.stringify(obj));
  }

  public getCfi(bookKey: string) {
    const json = localStorage.getItem('readingLocation');
    const obj = JSON.parse(json!) || {};
    return obj[bookKey] || {};
  }

  public clear(bookKey: string) {
    const json = localStorage.getItem('readingLocation');
    const obj = JSON.parse(json!) || {};
    delete obj[bookKey];
    localStorage.setItem('readingLocation', JSON.stringify(obj));
  }
}
