import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { BookCardsComponent } from './book-cards/book-cards.component';



@NgModule({
  declarations: [LibraryComponent, BookCardsComponent],
  imports: [
    CommonModule
  ]
})
export class LibraryModule { }
