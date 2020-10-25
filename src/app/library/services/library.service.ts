import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { BehaviorSubject } from 'rxjs';
import * as SparkMD5 from 'spark-md5';
import { MessageService } from 'src/app/message.service';
import { Book } from 'src/app/models/Book';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private ePub = (window as any).ePub;

  private booksIsLoaded = false;
  private books: Book[] = [];
  public booksSubject = new BehaviorSubject([]);

  constructor(
    private msgService: MessageService
  ) {
    this.loadBooks();
  }

  public addBook(book: Book) {
    this.books = this.books.concat([book]);
    this.booksSubject.next(this.books);
    localforage.setItem('books', this.books);
  }

  public getBooks() {
    return this.books;
  }

  public async getBook(key: string) {
    if (this.booksIsLoaded) {
      return this.books.find(book => book.key === key);
    } else {
      const books = await this.loadBooks();
      return books.find(book => book.key === key);
    }
  }

  public bookExists(md5: string|Book): boolean {
    if (typeof md5 !== 'string') {
      md5 = (md5 as Book).md5;
    }
    return this.books.some(book => book.md5 === md5);
  }

  public async loadBooks() {
    this.books = await localforage.getItem('books');
    this.booksSubject.next(this.books);
    this.booksIsLoaded = true;
    return this.books;
  }

  public async importBookFile(file: File): Promise<[any, Book]> {
    return await this.doIncrementalTest(file);
  }

  // 获取书籍md5
  private doIncrementalTest(file: any): Promise<[any, Book]> {
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
            resolve(await this.storeFileAndCreateBook(file, md5));
          }
        };

        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end = start + chunkSize >= file.size ? file.size : start + chunkSize;

          fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        loadNext();
      } else {
        this.msgService.message('Import Failed: not epub file');
        reject();
      }
    });
  }

  private storeFileAndCreateBook(file: any, md5: string): Promise<[any, Book]> {
    return new Promise((resolve, reject) => {
      // md5 重复不导入
      if (this.bookExists(md5)) {
        this.msgService.message('Duplicate Book');
        return resolve([null, null]);
      }
      // 解析图书，获取图书数据
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        if (!e.target) {
          this.msgService.message('Import Failed');
          reject();
          throw new Error();
        }
        const epub = this.ePub((e.target as any).result);
        epub.loaded.metadata
          .then((metadata: any) => {
            if (!e.target) {
              this.msgService.message('Import Failed: no metadata');
              reject();
              throw new Error();
            }

            epub
              .coverUrl()
              .then(async (url: string) => {
                const createBook = async (cover: string) => {
                  const [name, author, description] = [
                    metadata.title,
                    metadata.creator,
                    metadata.description,
                  ];
                  const key = new Date().getTime() + '';
                  const book = new Book(
                    key,
                    name,
                    author,
                    description,
                    md5,
                    cover
                  );
                  // await this.handleAddBook(book);
                  this.addBook(book);

                  localforage.setItem(key, (e.target as any).result);
                  resolve([epub, book]);
                };

                if (url) {
                  const coverReader = new FileReader();
                  const blob = await fetch(url).then((r) => r.blob());
                  coverReader.readAsDataURL(blob);
                  console.log(url, 'url');
                  coverReader.onloadend = async () => {
                    await createBook(coverReader.result as string);
                  };
                } else {
                  await createBook('noCover');
                }

              })
              .catch((err: any) => {
                console.log(err, 'err');
                reject();
              });
          })
          .catch(() => {
            this.msgService.message('Import Failed');
            // this.props.handleMessageBox(true);
            reject();
          });
      };

    });
  }
}
