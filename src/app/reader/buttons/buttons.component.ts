import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as screenfull from 'screenfull';
import { ConfigService } from 'src/app/config/config.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { ReaderService } from '../reader.service';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-reader-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
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
    const dialog = this.dialog.open(NavigationComponent, {
      autoFocus: false,
      position: {
        top: '40px',
        left: '20px'
      },
      panelClass: ['reading-navigation-dialog-panel'],
      backdropClass: 'reading-navigation-dialog-backdrop', // disable default backgroup styles
      width: '340px',
      height: 'calc(100vh - 60px)',
      data: {}
    });
    dialog.afterOpened().subscribe(() => {
    });
  }

  async openSettings() {
    this.dialog.open(SettingsComponent, {
      autoFocus: false,
      position: {
        top: '40px',
        right: '20px',
      },
      panelClass: ['reading-settings-dialog-panel'],
      backdropClass: 'reading-settings-dialog-backdrop', // disable default backgroup styles
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
