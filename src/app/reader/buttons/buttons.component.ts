import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { ConfigService } from 'src/app/config/config.service';
import { ReaderService } from '../reader.service';
import * as screenfull from 'screenfull';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reader-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Output() openNav = new EventEmitter<void>();
  public isFullscreen = false;

  constructor(
    private router: Router,
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
    // 不知怎的，这个按钮没有自动 blur。
    (document.activeElement as any).blur();
  }

  async openSettings() {
    this.dialog.open(SettingsComponent, {
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
  }

  goLibrary() {
    this.router.navigate(['/']);
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
