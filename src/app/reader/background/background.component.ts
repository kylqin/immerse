import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  selector: 'app-reader-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  public backgroundColor = '';

  private pageMode: string;
  public get isSingleMode() {
    return this.pageMode !== 'double';
  }

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.watchSettings();
    this.backgroundColor = this.configService.getItem('reader.theme') as string;
    this.pageMode = this.configService.getItem('reader.pageMode') as string;
   }

   watchSettings() {
    this.configService.listen('reader.theme').subscribe((theme: string) => {
      this.backgroundColor = theme;
    });

    this.configService.listen('reader.pageMode').subscribe((pageMode: string) => {
      this.pageMode = pageMode;
    });
   }

}
