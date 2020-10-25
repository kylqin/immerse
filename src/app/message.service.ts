import { Injectable, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  spinnerSubject = new BehaviorSubject(false);

  constructor(private snackBar: MatSnackBar, private ngZone: NgZone) { }

  message(msg: string) {
    console.log('MSG::', msg);
    this.ngZone.run(() => {
      this.snackBar.open(msg, '', {
        duration: 500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    });
  }

  startSpinner(msg?: string) {
    console.log('START SPINNER::', msg);
    this.spinnerSubject.next(true);
  }

  stopSpinner() {
    console.log('STOP SPINNER::');
    this.ngZone.run(() => {
      this.spinnerSubject.next(false);
    });
  }
}
