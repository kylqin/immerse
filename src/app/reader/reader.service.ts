import { Injectable } from '@angular/core';
import { Book } from '../models/Book';
import * as localforage from 'localforage';
import * as SparkMD5 from 'spark-md5';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private ePub = (window as any).ePub;

  public currentBook: any = { key: '1603109063292' };

  public currentEpub = null;

  public toc = new BehaviorSubject([]);
  public flattenedToc = null;
  public notes = [];
  public bookmarks = [];

  constructor() { }

  public async openBook(key: string);
  public async openBook(url: string);
  public async openBook(file: any) {
    if (typeof file === 'string') {
      this.currentEpub = this.ePub(await localforage.getItem(file));
    } else {
      this.currentEpub = await this.doIncrementalTest(file);
    }
    this.fetchChapters(this.currentEpub);
    return this.currentEpub;
  }

  private handleAddBook = (book: Book) => {
    this.currentBook = book;
    return new Promise((resolve, reject) => {
      // let bookArr = this.props.books;
      let bookArr;

      if (bookArr == null) {
        bookArr = [];
      }
      bookArr.push(book);
      // RecordRecent.setRecent(book.key);
      localforage
        .setItem('books', bookArr)
        .then(() => {
          // this.props.handleFetchBooks();
          // this.props.handleMessage("Add Successfully");
          // this.props.handleMessageBox(true);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  // 获取书籍md5
  private doIncrementalTest(file: any) {
    return new Promise((resolve, reject) => {
      // 这里假设直接将文件选择框的dom引用传入
      // 这里需要用到File的slice( )方法，以下是兼容写法
      const fileName = file.name.split('.');
      const extension = fileName[fileName.length - 1];
      if (extension === 'epub') {
        const blobSlice =
            (File as any).prototype.slice ||
            (File as any).prototype.mozSlice ||
            (File as any).prototype.webkitSlice;

        const chunkSize = 2097152; // 以每片2MB大小来逐次读取
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5(); // 创建SparkMD5的实例
        const fileReader = new FileReader();

        fileReader.onload = async (e) => {
          if (!e.target) {
            reject();
            throw new Error();
          }
          spark.appendBinary((e.target as any).result as any); // append array buffer
          currentChunk += 1;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            const md5 = spark.end(); // 完成计算，返回结果
            resolve(await this.handleBook(file, md5));
          }
        };

        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end = start + chunkSize >= file.size ? file.size : start + chunkSize;

          fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        loadNext();
      } else {
        // this.props.handleMessage("Import Failed");
        // this.props.handleMessageBox(true);
        reject();
      }
    });
  }

  private handleBook(file: any, md5: string) {
    return new Promise((resolve, reject) => {
      // md5 重复不导入
      let isRepeat = false;
      // if (this.props.books) {
      //   this.props.books.forEach((item) => {
      //     if (item.md5 === md5) {
      //       isRepeat = true;
      //       // this.props.handleMessage("Duplicate Book");
      //       // this.props.handleMessageBox(true);
      //       resolve();
      //     }
      //   });
      // }
      // 解析图书，获取图书数据
      if (!isRepeat) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          if (!e.target) {
            // this.props.handleMessage("Import Failed");
            // this.props.handleMessageBox(true);
            reject();
            throw new Error();
          }
          let cover: any = '';
          const epub = this.ePub((e.target as any).result);
          epub.loaded.metadata
            .then((metadata: any) => {
              if (!e.target) {
                reject();
                throw new Error();
              }

              epub
                .coverUrl()
                .then(async (url: string) => {
                  if (url) {
                    const reader = new FileReader();
                    const blob = await fetch(url).then((r) => r.blob());
                    reader.readAsDataURL(blob);
                    console.log(url, 'url');
                    reader.onloadend = async () => {
                      cover = reader.result;
                      // console.log(cover, 'cover');
                      let key: string;

                      const [name, author, description] = [
                        metadata.title,
                        metadata.creator,
                        metadata.description,
                      ];
                      key = new Date().getTime() + '';
                      console.log('key', key)
                      const book = new Book(
                        key,
                        name,
                        author,
                        description,
                        md5,
                        cover
                      );
                      await this.handleAddBook(book);
                      localforage.setItem(key, (e.target as any).result);
                      resolve(epub);
                    };
                  } else {
                    cover = 'noCover';
                    let key: string;
                    const [name, author, description] = [
                      metadata.title,
                      metadata.creator,
                      metadata.description,
                    ];
                    key = new Date().getTime() + '';
                    const book = new Book(
                      key,
                      name,
                      author,
                      description,
                      md5,
                      cover
                    );
                    await this.handleAddBook(book);
                    localforage.setItem(key, (e.target as any).result);
                    resolve(epub);
                  }
                })
                .catch((err: any) => {
                  console.log(err, 'err');
                  reject();
                });
            })
            .catch(() => {
              // this.props.handleMessage("Import Failed");
              // this.props.handleMessageBox(true);
              console.log('Error occurs');
              reject();
            });
        };
      }
    });
  }

  /* rendition utils */
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
