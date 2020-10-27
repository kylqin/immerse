import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportBooksComponent } from '../import-books/import-books.component';

@Component({
  selector: 'app-lib-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openImportDialog() {
    this.dialog.open(ImportBooksComponent, {
      hasBackdrop: false,
      autoFocus: false,
      width: 'calc(100vw - 460px)',
      height: 'calc(100vh - 200px)',
      maxWidth: '1000px',
      maxHeight: '600px',
    });
  }
}
