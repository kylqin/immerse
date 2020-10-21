import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  selector: 'app-reader-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(public dialog: MatDialog, public configService: ConfigService) { }

  ngOnInit(): void {
  }

  async openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '300px',
      data: {
        theme: await this.configService.getItem('reader.theme'),
        pageMode: await this.configService.getItem('reader.pageMode'),
        pageScale: await this.configService.getItem('reader.pageScale'),
        fontFamily: await this.configService.getItem('reader.fontFamily'),
        fontSize: await this.configService.getItem('reader.fontSize'),
        lineHeight: await this.configService.getItem('reader.lineHeight'),
      }
    });

    dialogRef.afterClosed().subscribe((readerConfigData) => {
      if (readerConfigData) {
        console.log('readerConfigData', readerConfigData);
        this.configService.setItem('reader.theme', readerConfigData.theme);
        this.configService.setItem('reader.pageMode', readerConfigData.pageMode);
        this.configService.setItem('reader.pageScale', readerConfigData.pageScale);
        this.configService.setItem('reader.fontFamily', readerConfigData.fontFamily);
        this.configService.setItem('reader.fontSize', readerConfigData.fontSize);
        this.configService.setItem('reader.lineHeight', readerConfigData.lineHeight);
      }
    });
  }

}
