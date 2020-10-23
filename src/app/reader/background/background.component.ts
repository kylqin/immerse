import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { ReaderService } from '../reader.service';

@Component({
  selector: 'app-reader-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  public backgroundColor = '';

  public bookName = '';
  public chapter = '';
  public leftPage = '';
  public rightPage = '';

  private pageMode: string;
  public get isSingleMode() {
    return this.pageMode !== 'double';
  }

  constructor(
    private configService: ConfigService,
    private readerService: ReaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.watchSettings();
    this.watchInfo();

    this.bookName = this.readerService.currentBook.name;

    this.backgroundColor = this.configService.getItem('reader.theme') as string;
    this.pageMode = this.configService.getItem('reader.pageMode') as string;
   }

   watchSettings() {
    this.configService.listen('reader.theme').subscribe((theme: string) => {
      this.backgroundColor = theme;
    });

    this.configService.listen('reader.pageMode').subscribe((pageMode: string) => {
      this.pageMode = pageMode;
    });
  }

  watchInfo() {
    this.readerService.currentChapter.subscribe(chapter => {
      this.chapter = chapter;
      // see: https://zhuanlan.zhihu.com/p/100038957
      this.changeDetectorRef.detectChanges();
    });
    this.readerService.leftPage.subscribe(leftPage => {
      this.leftPage = leftPage;
    });
    this.readerService.rightPage.subscribe(rightPage => {
      this.rightPage = rightPage;
      document.documentElement.click();
    });
  }

}
