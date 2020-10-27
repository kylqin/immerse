import { Component, OnInit } from '@angular/core';
import { ReaderService } from '../reader.service';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  selector: 'app-reader-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // public backgroundColor = '';
  public isSearch = false;
  public currentTab = 'contents';

  public get bookName () { return this.readerService.currentBook ? this.readerService.currentBook.name : ''; }
  public get author () { return this.readerService.currentBook ? this.readerService.currentBook.author : ''; }

  constructor(
    // private configService: ConfigService,
    public readerService: ReaderService
  ) { }

  ngOnInit(): void {
    // this.backgroundColor = this.configService.getItem('reader.theme') as string;
    // this.configService.listen('reader.theme').subscribe((theme: string) => {
    //   this.backgroundColor = theme;
    // });
  }

  changeTab(tab: string) {}

}
