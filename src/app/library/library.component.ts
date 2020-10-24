import { Component, OnInit } from '@angular/core';
import { Book } from '../models/Book';
import { LibraryService } from './services/library.service';
import { ReaderService } from '../reader/reader.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  public books: Book[] = [];

  constructor(
    private libraryService: LibraryService,
    private readerService: ReaderService,
  ) {
    libraryService.booksSubject.subscribe(books => {
      this.books = books;
      console.log('books', books);
    });
  }

  ngOnInit(): void {
  }

  async selectBook(event) {
    const file = event.target.files[0]
    const epub = await this.readerService.openBook(file);
    // const settings = this.getSettings();
    // this.read(epub, this.buildRenderOptions(settings.pageMode), settings);
  }

}
