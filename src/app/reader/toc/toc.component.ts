import { Component, OnInit } from '@angular/core';
import { ReaderService } from '../reader.service';

@Component({
  selector: 'app-reader-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit {
  public toc = null;
  public openedMenus = {};

  constructor(private readerService: ReaderService) { }

  ngOnInit(): void {
    this.readerService.tocSubject.subscribe((toc) => {
      this.toc = toc;
    });
  }

  jump(event: any) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    this.readerService.jump(href);
  }

  toggleSubtree(href: string) {
    this.openedMenus[href] = !this.openedMenus[href];
  }

}
