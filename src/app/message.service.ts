import { Injectable, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

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
}
