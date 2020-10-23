import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { ConfigService } from 'src/app/config/config.service';
import { ReaderService } from '../reader.service';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-reader-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Output() openNav = new EventEmitter<void>();
  public isFullscreen = false;

  constructor(
    public dialog: MatDialog,
    private configService: ConfigService,
    private readerService: ReaderService,
  ) {
    (screenfull as screenfull.Screenfull).on('change', (e) => {
      this.isFullscreen = (screenfull as screenfull.Screenfull).isFullscreen;
    });
  }

  ngOnInit(): void {}

  openNavigation() {
    this.openNav.emit();
  }

  async openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '300px',
      data: {
        theme: this.configService.getItem('reader.theme'),
        pageMode: this.configService.getItem('reader.pageMode'),
        pageScale: this.configService.getItem('reader.pageScale'),
        fontFamily: this.configService.getItem('reader.fontFamily'),
        fontSize: this.configService.getItem('reader.fontSize'),
        lineHeight: this.configService.getItem('reader.lineHeight'),
      }
    });

    dialogRef.afterClosed().subscribe((readerConfigData) => {
      if (readerConfigData) {
        // console.log('readerConfigData', readerConfigData);
        // this.configService.setItem('reader.theme', readerConfigData.theme);
        // this.configService.setItem('reader.pageMode', readerConfigData.pageMode);
        // this.configService.setItem('reader.pageScale', readerConfigData.pageScale);
        // this.configService.setItem('reader.fontFamily', readerConfigData.fontFamily);
        // this.configService.setItem('reader.fontSize', readerConfigData.fontSize);
        // this.configService.setItem('reader.lineHeight', readerConfigData.lineHeight);
      }
    });
  }

  toggleFullscreen() {
    (screenfull as screenfull.Screenfull).toggle();
  }

  previous() {
    this.readerService.prev(this.configService.getItem('reader.pageMode') as string);
  }

  next() {
    this.readerService.next(this.configService.getItem('reader.pageMode') as string);
  }

}
