import { Injectable } from '@angular/core';
import { Book } from '../models/Book';
import * as localforage from 'localforage';
import * as SparkMD5 from 'spark-md5';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  public currentBook: any = null;
  private ePub = (window as any).ePub;

  private currentEpub = null;

  constructor() { }

  public async openBook(key: string);
  public async openBook(url: string);
  public async openBook(file: any) {
    if (typeof file === 'string') {
      this.currentEpub = this.ePub(await localforage.getItem(file));
    } else {
      this.currentEpub = await this.doIncrementalTest(file);
    }
    return this.currentEpub;
  }

  private handleAddBook = (book: Book) => {
    return new Promise((resolve, reject) => {
      // let bookArr = this.props.books;
      let bookArr

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

  // settings

  public setPageMode(mode: 'single' | 'double' | 'scroll' | 'continuous') {
    // todo
  }

  public setTheme(theme: string) { // backgorund color
    // todo
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
}
