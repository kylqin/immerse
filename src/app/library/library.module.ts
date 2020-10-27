import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { BookCardsComponent } from './book-cards/book-cards.component';
import { FiltersComponent } from './filters/filters.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { ImportBooksComponent } from './import-books/import-books.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [LibraryComponent, BookCardsComponent, ButtonsComponent, FiltersComponent, ImportBooksComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    NgxFileDropModule
  ]
})
export class LibraryModule { }
