import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-import-books',
  templateUrl: './import-books.component.html',
  styleUrls: ['./import-books.component.scss']
})
export class ImportBooksComponent implements OnInit {
  public data = {};
  public isFileOver = false;
  public status: 'waiting'|'uploading'|'ready' = 'waiting';
  public uploadProgress = 0;

  constructor(
    private libraryService: LibraryService,
    public dialogRef: MatDialogRef<ImportBooksComponent>
  ) { }

  ngOnInit(): void {}

  async importBookFromLocal(event) {
    const file = event.target.files[0]
    await this.libraryService.importBookFile(file);
  }

  public droped(files: NgxFileDropEntry[]) {
    this.isFileOver = false;
    this.status = 'uploading';
    this.uploadProgress = 0;

    let importedCount = 1;
    const ratio = 1 / files.length;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
          await this.libraryService.importBookFile(file, (percent: number) => {
            this.uploadProgress = importedCount * ratio + percent / 100 * ratio;
          });
          importedCount += 1;
          if (importedCount >= files.length) {
            this.status = 'ready';
            this.close();
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fileOver() {
    this.isFileOver = true;
  }

  fileLeave() {
    this.isFileOver = false;
  }

  close() {
    this.dialogRef.close();
  }
}
