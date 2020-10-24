import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/models/Book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lib-book-cards',
  templateUrl: './book-cards.component.html',
  styleUrls: ['./book-cards.component.scss']
})
export class BookCardsComponent implements OnInit {
  @Input() public books: Book[];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openBook(book: Book) {
    this.router.navigate(['/reader', book.key]);
  }

}
