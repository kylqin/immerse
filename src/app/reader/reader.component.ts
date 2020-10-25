import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReaderService } from './reader.service';
import { ConfigService } from '../config/config.service';
import { ReadingLocationService } from './reading-location.service';
import { ReadingProgress } from '../models/ReadingProgress';
import { MouseService } from './mouse.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, OnDestroy {
  private subscribesForSettings: Subscription[] = [];
  private pageMode = 'continuous';

  private readingProgress = new ReadingProgress();

  get isSingleMode() {
    return this.pageMode !== 'double';
  }

  constructor(
    private route: ActivatedRoute,
    private rlService: ReadingLocationService,
    private readerService: ReaderService,
    private configService: ConfigService,
    private mouseService: MouseService,
    ) {}

  async ngOnInit() {
    const key = this.route.snapshot.paramMap.get('key');

    const settings = this.getSettings();

    this.read(await this.readerService.openBook(key), this.buildRenderOptions(settings.pageMode), settings);
  }

  ngOnDestroy() {
    // 记得，watch settings 变化，避免 read 生成多个 [epub文档dom: 即 .epub-container].
    this.unwatchSettings();
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

    // console.log('pageMode', this.pageMode);
    // console.log('isSingleMode', this.isSingleMode);
    // console.log('options', options);

    return options;
  }

  /**
   * 监听阅读设置的变化，同步设置到阅读界面
   */
  watchSettings() {
    // 去掉之前的监听，避免重复
    this.unwatchSettings();

    this.subscribesForSettings = [
      this.configService.listen('reader.theme').subscribe((theme: string) => {
        this.readerService.setTheme(theme);
      }),

      this.configService.listen('reader.pageMode').subscribe(async (pageMode: string) => {
        if (this.pageMode === pageMode) {
          return;
        }

        this.pageMode = pageMode;
        setTimeout(async () => {
          // 书籍内容页面模式变更时，需要重新渲染内容，且使用 setTimeout, 将渲染人物排到"浏览器重排"之后
          // 书籍内容页面模式变化后，书籍内容页面尺寸发生变化，会引起浏览器重排和重绘
          this.read(this.readerService.currentEpub, this.buildRenderOptions(pageMode), this.getSettings());
        }, 0);
      }),

      this.configService.listen('reader.fontSize').subscribe((fontSize: string) => {
        this.readerService.setFontSize(Number(fontSize));
      }),
      this.configService.listen('reader.fontFamily').subscribe((fontFamily: string) => {
        this.readerService.setFontFamily(fontFamily);
      }),
      this.configService.listen('reader.lineHeight').subscribe((lineHeight: string) => {
        this.readerService.setLineHeight(Number(lineHeight));
      }),
    ];
  }

  unwatchSettings() {
    this.subscribesForSettings.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public getSettings() {
    const settings = this.configService.getReadingSettings();
    this.pageMode = settings.pageMode as string;
    return settings;
  }

  read(epub, renderOptions, settings) {
    this.readingProgress.fetchLocations(epub);

    const pageArea = document.getElementById('page-area');
    // 删除原来的渲染结果，避免渲染多个
    pageArea.innerHTML = '';

    epub.renderTo('page-area', renderOptions);

    // 监听 epub 事件
    this.watchEpub(epub, settings);

    // 注册鼠标事件
    this.mouseService.bind(epub, !(settings.pageMode === 'single' || settings.pageMode === 'double'));

    // 设置 阅读设置
    this.readerService.applySettings(epub, settings);

    // 根据记录的阅读位置显示
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

      // 要在第一 read 只后再监听 settings, 避免两次“几乎同时” read,
      // 造成在 [epub 渲染 dom: 即 #page-area] 上生成两个 [epub文档dom: 即 .epub-container].
      this.watchSettings();
      // ReaderConfig.addDefaultCss();
    });
    epub.rendition.on('selected', (cfiRange: any, contents: any) => {
      const range = contents.range(cfiRange);
      const rect = range.getBoundingClientRect();
      // this.setState({ cfiRange, contents, rect });
    });
  }

}
