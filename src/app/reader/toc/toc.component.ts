import { Component, OnInit } from '@angular/core';
import { ReaderService } from '../reader.service';

@Component({
  selector: 'app-reader-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit {
  public toc = null;
  public currentIndex = -1;

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

  toggleSubtree(index: number) {
    this.currentIndex = index === this.currentIndex ? -1 : index;
  }

}
