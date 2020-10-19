import { Component, OnInit } from '@angular/core';
import { ReaderService } from './reader.service';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {
  public rendition = null;

  public renderOptions = {
    manager: 'continuous',
    flow: 'scrolled',
    width: '100%',
    height: '100%',
  };

  constructor(private readerService: ReaderService, private configService: ConfigService) {}

  async ngOnInit() {
    const key = '1603109063292';

    this.configService.listen('reader.fontSize').subscribe((fontSize: string) => {
      this.readerService.setFontSize(Number(fontSize));
    });
    this.configService.listen('reader.fontFamily').subscribe((fontFamily: string) => {
      this.readerService.setFontFamily(fontFamily);
    });
    this.configService.listen('reader.lineHeight').subscribe((lineHeight: string) => {
      this.readerService.setLineHeight(Number(lineHeight));
    });

    setTimeout(() => {
      // this.configService.setItem('reader.fontSize', 30);
    }, 2000);

    this.read(await this.readerService.openBook(key));
  }

  async selectBook(event) {
    const file = event.target.files[0]
    // console.log('file ->', file)
    const epub = await this.readerService.openBook(file)
    // console.log('epub ->', epub);
    this.read(epub)
  }

  read(epub) {
    this.rendition = epub.renderTo('page-area', this.renderOptions);

    console.log('epub.rendition', epub.rendition === this.rendition)

    const displayed = this.rendition.display();

    // displayed.then((renderer) => {
    //   // -- do stuff
    // });

    // // Navigation loaded
    // book.loaded.navigation.then(function(toc){
    //   // console.log(toc);
    // });
  }
}
