import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { BehaviorSubject } from 'rxjs';
import { LibraryService } from '../library/services/library.service';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private ePub = (window as any).ePub;

  public currentBook: any = { key: '1603109063292', name: 'Sarmantan' };

  public currentEpub = null;

  public toc = new BehaviorSubject([]);
  public flattenedToc = null;
  public notes = [];
  public bookmarks = [];

  public currentChapter = new BehaviorSubject('');
  public leftPage = new BehaviorSubject('');
  public rightPage = new BehaviorSubject('');

  constructor(
    private libraryService: LibraryService
  ) { }

  public async openBook(key: string);
  public async openBook(url: string);
  public async openBook(file: any) {
    if (typeof file === 'string') {
      this.currentEpub = this.ePub(await localforage.getItem(file));
      this.currentBook = this.libraryService.getBook(file);
    } else {
      [this.currentEpub, this.currentBook] = await this.libraryService.importBookFile(file);
    }
    this.fetchChapters(this.currentEpub);
    return this.currentEpub;
  }

  // 获取书籍md5
  /* rendition utils */
  public prev(pageMode: string) {
    if (pageMode === 'single' || pageMode === 'double') {
      this.currentEpub.rendition.prev();
    } else {
      this.nextChapter(-1);
    }
  }

  public next(pageMode: string) {
    if (pageMode === 'single' || pageMode === 'double') {
      this.currentEpub.rendition.next();
    } else {
      this.nextChapter();
    }
  }

  public previousChapter() {
    this.nextChapter(-1);
  }

  public nextChapter(step: number = 1) {
    const currentLocation = this.currentEpub.rendition.currentLocation();
    if (!currentLocation.start) {
      return;
    }
    const chapterIndex = currentLocation.start.index;
    const section = this.currentEpub.section(chapterIndex + step);
    if (section && section.href) {
      this.currentEpub.rendition.display(section.href);
    }
  }

  /**
   * navigation informations
   * incluces: [chapters, bookmarks, notes]
   */
  private async fetchChapters(epub) {
    epub.loaded.navigation
      .then((chapters: any) => {
        // this.toc = chapters.toc;
        this.toc.next(chapters.toc);
        this.flattenedToc = flatChapter(chapters.toc);
      })
      .catch(() => {
        console.log('Error occurs');
      });
  }

  public touchCurrentChapter(epub) {
    const currentLocation = epub.rendition.currentLocation();
    if (!currentLocation.start) {
      return;
    }

    this.leftPage.next(currentLocation.start.displayed.page);
    this.rightPage.next(currentLocation.end.displayed.page);

    const chapterHref = currentLocation.start.href;
    let chapter = 'Unknown Chapter';
    const currentChapter = this.flattenedToc.filter(
      (item: any) => item.href.split('#')[0] === chapterHref
    )[0];
    if (currentChapter) {
      chapter = currentChapter.label.trim();
    }
    this.currentChapter.next(chapter);
  }

  // settings

  // public setPageMode(mode: 'single' | 'double' | 'scroll' | 'continuous') {
  public setPageMode(mode: string) {
    // todo
    // const rendition = this.currentEpub.rendition;
    // rendition.viewManager = rendition.requireManager(
    //   mode === 'continuous' ? 'continuous' : 'default'
    // );

    // rendition.View = rendition.requireView(rendition.settings.view);

    // rendition.manager = new rendition.ViewManager({
    //   view: rendition.View,
    //   queue: rendition.q,
    //   request: rendition.book.load.bind(rendition.book),
    //   settings: rendition.settings
    // });

    // const flow = mode === 'scroll'
    //   ? 'scrolled-doc'
    //   : mode === 'continuous'
    //   ? 'scrolled'
    //   : 'auto';
    // // this.currentEpub.rendition.setManager(manager);
    // this.currentEpub.rendition.flow(flow);
  }

  public setTheme(theme: string) { // backgorund color
    // todo: 使用 inherit 后，使一些元素(比如 a, 链接和目录项)失去了原本的颜色
    console.log('themes', this.currentEpub.rendition.themes);
    this.currentEpub.rendition.themes.default({
      'a, article, cite, code, div, li, p, pre, span, table': {
        color: `${theme === 'rgba(44,47,49,1)' ? 'white' : 'inherit'} !important`,
        // color: `${theme === 'rgba(44,47,49,1)' ? 'white!important' : 'inherit'}`,
      },
    });
  }

  public setFontSize(size: number) {
    this.currentEpub.rendition.themes.default({
      'a, article, cite, code, div, li, p, pre, span, table': {
      'font-size': `${size || 17}px !important`,
      },
    });
  }

  public setFontFamily(fontFamily: string) {
    this.currentEpub.rendition.themes.default({
      'a, article, cite, code, div, li, p, pre, span, table': {
        'font-family': `${fontFamily || 'Helvetica'} !important`,
      },
    });
  }

  public setLineHeight(lineHeight: number) {
    this.currentEpub.rendition.themes.default({
      'a, article, cite, code, div, li, p, pre, span, table': {
        'line-height': `${lineHeight || '1.25'} !important`,
      },
    });
  }

  public setScale(scale: number) {
    // todo
  }

  applySettings(epub, settings) {
    const isUseFont = false;

    epub.rendition.themes.default({
      'a, article, cite, code, div, li, p, pre, span, table': {
        'font-size': `${
          // OtherUtil.getReaderConfig("isUseFont") === "yes"
          isUseFont
            ? ''
            : settings.fontSize || 17
        }px !important`,
        'line-height': `${
          // OtherUtil.getReaderConfig("isUseFont") === "yes"
          isUseFont
            ? ''
            : settings.lineHeight || '1.25'
        } !important`,
        'font-family': `${
          // OtherUtil.getReaderConfig("isUseFont") === "yes"
          isUseFont
            ? ''
            : settings.fontFamily || 'Helvetica'
        } !important`,
        color: `${
          // OtherUtil.getReaderConfig("theme") === "rgba(44,47,49,1)"
          settings.theme === 'rgba(44,47,49,1)'
            ? 'white'
            : ''
        } !important`,
      },
    });
  }

}

function flatChapter(chapters: any) {
  let newChapter: any = [];
  for (const chapter of chapters) {
    if (chapter.subitems[0]) {
      newChapter.push(chapter);
      newChapter = newChapter.concat(flatChapter(chapter.subitems));
    } else {
      newChapter.push(chapter);
    }
  }
  return newChapter;
}
