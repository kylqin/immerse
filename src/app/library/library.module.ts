import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { BookCardsComponent } from './book-cards/book-cards.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxFileDropModule } from 'ngx-file-drop';



@NgModule({
  declarations: [LibraryComponent, BookCardsComponent, ButtonsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxFileDropModule
  ]
})
export class LibraryModule { }
