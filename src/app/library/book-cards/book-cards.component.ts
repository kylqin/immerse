import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Book } from 'src/app/models/Book';
import { LibraryService } from '../services/library.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-lib-book-cards',
  templateUrl: './book-cards.component.html',
  styleUrls: ['./book-cards.component.scss']
})
export class BookCardsComponent implements OnInit {
  @Input() public books: Book[];

  public isFileOver = false;

  constructor(
    private router: Router,
    private msgService: MessageService,
    private libraryService: LibraryService
  ) { }

  ngOnInit(): void {
  }

  openBook(book: Book) {
    this.router.navigate(['/reader', book.key]);
  }

  public droped(files: NgxFileDropEntry[]) {
    console.log(files);
    this.isFileOver = false;
    this.msgService.startSpinner();

    let importedCount = 1;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
          await this.libraryService.importBookFile(file);
          importedCount += 1;
          if (importedCount >= files.length) {
            this.msgService.stopSpinner();
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log('over', event);
    this.isFileOver = true;
  }

  public fileLeave(event) {
    console.log('leave', event);
    this.isFileOver = false;
  }

}
