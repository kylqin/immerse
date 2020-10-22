import { Component, OnInit } from '@angular/core';
import { ReaderService } from '../reader.service';

@Component({
  selector: 'app-reader-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public isSearch = false;
  public currentTab = 'contents';

  constructor(
    public readerService: ReaderService
  ) { }

  ngOnInit(): void {
  }

  changeTab(tab: string) {}

}
