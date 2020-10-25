import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'immerse';
  showSpinner = false;

  constructor(private msgService: MessageService) {
    this.msgService.spinnerSubject.subscribe(show => {
      this.showSpinner = show;
    });
  }
}
