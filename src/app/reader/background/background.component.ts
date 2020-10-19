import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  selector: 'app-reader-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  public backgroundColor = 'rgba(235,255,231,1)';

  public get isSingleMode() {
    return true;
  }

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.configService.listen('reader.theme').subscribe((theme: string) => {
      this.backgroundColor = theme;
    });
   }

}
