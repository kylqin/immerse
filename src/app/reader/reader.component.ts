import { Component, OnInit } from '@angular/core';
import { ReaderService } from './reader.service';
import { ConfigService } from '../config/config.service';
import { ReadingLocationService } from './reading-location.service';
import { ReadingProgress } from '../models/ReadingProgress';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {
  private pageMode = 'continuous';

  private readingProgress = new ReadingProgress();

  get isSingleMode() {
    return this.pageMode !== 'double';
  }

  constructor(
    private rlService: ReadingLocationService,
    private readerService: ReaderService,
    private configService: ConfigService) {}

  async ngOnInit() {
    this.watchSettings();

    const settings = this.getSettings();

    this.read(await this.readerService.openBook(this.readerService.currentBook.key), this.buildRenderOptions(settings.pageMode), settings);
  }

  buildRenderOptions(pageMode: string) {
    const options = {
      manager:
        pageMode === 'continuous' ? 'continuous' : 'default',
      flow:
        pageMode === 'scroll'
          ? 'scrolled-doc'
          : pageMode === 'continuous'
          ? 'scrolled'
          : 'auto',
      width: '100%',
      height: '100%',
      snap: true,
    };

    console.log('pageMode', this.pageMode);
    console.log('isSingleMode', this.isSingleMode);
    console.log('options', options);

    return options;
  }

  watchSettings() {
    this.configService.listen('reader.theme').subscribe((theme: string) => {
      this.readerService.setTheme(theme);
    });

    this.configService.listen('reader.pageMode').subscribe(async (pageMode: string) => {
      this.pageMode = pageMode;
      setTimeout(async () => {
        this.read(this.readerService.currentEpub, this.buildRenderOptions(pageMode), this.getSettings());
      }, 0);
    });

    this.configService.listen('reader.fontSize').subscribe((fontSize: string) => {
      this.readerService.setFontSize(Number(fontSize));
    });
    this.configService.listen('reader.fontFamily').subscribe((fontFamily: string) => {
      this.readerService.setFontFamily(fontFamily);
    });
    this.configService.listen('reader.lineHeight').subscribe((lineHeight: string) => {
      this.readerService.setLineHeight(Number(lineHeight));
    });
  }

  public getSettings() {
    const settings = this.configService.getReadingSettings();
    this.pageMode = settings.pageMode as string;
    return settings;
  }

  async selectBook(event) {
    const file = event.target.files[0]
    const epub = await this.readerService.openBook(file);
    const settings = this.getSettings();
    this.read(epub, this.buildRenderOptions(settings.pageMode), settings);
  }

  read(epub, renderOptions, settings) {
    this.readingProgress.fetchLocations(epub);

    const pageArea = document.getElementById('page-area');
    pageArea.innerHTML = '';

    epub.renderTo('page-area', renderOptions);

    this.watchEpub(epub, settings);

    this.readerService.applySettings(epub, settings);

    console.log('curr location', this.rlService.getCfi(this.readerService.currentBook.key));

    epub.rendition.display(
      this.rlService.getCfi(this.readerService.currentBook.key) === null
        ? null
        : this.rlService.getCfi(this.readerService.currentBook.key).cfi
    );
  }

  watchEpub(epub, settings) {
    // (window as any).rangy.init(); // 初始化
    epub.rendition.on('locationChanged', () => {
      this.readerService.touchCurrentChapter(epub);
      // this.props.handleReadingEpub(epub);
      // this.props.handleOpenMenu(false);
      const currentLocation = epub.rendition.currentLocation();
      const cfi = currentLocation.start.cfi;
      // this.props.handleShowBookmark(
      //   this.props.bookmarks &&
      //     this.props.bookmarks.filter(
      //       (item: BookmarkModel) => item.cfi === cfi
      //     )[0]
      //     ? true
      //     : false
      // );
      if (this.readingProgress.locations) {
        const percentage = this.readingProgress.locations.percentageFromCfi(cfi);
        this.rlService.recordCfi(this.readerService.currentBook.key, cfi, percentage);
        this.readingProgress.percentage = percentage;
      }
    });
    epub.rendition.on('rendered', () => {
      // this.setState({ loading: false });
      const iframe = document.getElementsByTagName('iframe')[0];
      if (!iframe) {
        return;
      }
      const doc = iframe.contentDocument;
      if (!doc) {
        return;
      }
      // ReaderConfig.addDefaultCss();
    });
    epub.rendition.on('selected', (cfiRange: any, contents: any) => {
      const range = contents.range(cfiRange);
      const rect = range.getBoundingClientRect();
      // this.setState({ cfiRange, contents, rect });
    });
  }

}
