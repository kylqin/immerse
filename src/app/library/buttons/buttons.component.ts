import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-lib-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(
    private libraryService: LibraryService
  ) { }

  ngOnInit(): void {
  }

  async importBookFromLocal(event) {
    const file = event.target.files[0]
    await this.libraryService.importBookFile(file);
  }

}
