import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/config/config.service';
import { ReaderConf } from 'src/app/models/ReaderConf';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

export interface SettingsDialogData {
  theme: string; // background color
  pageMode: string;
  pageScale: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
};

type Controls = { [key: string]: FormControl };

@Component({
  selector: 'app-reader-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public themes = [
    { id: 1, theme: 'rgba(235,255,231,1)' },
    { id: 2, theme: 'rgba(244,232,211,0.4)' },
    { id: 3, theme: 'rgba(242,219,187,0.8)' },
    { id: 4, theme: 'rgba(255,254,252,1)' },
    { id: 5, theme: 'rgba(44,47,49,1)' },
  ];

  public pageModes = [
    { value: 'single', icon: 'icon-single-page' },
    { value: 'double', icon: 'icon-two-page' },
    { value: 'scroll', icon: 'icon-scroll1' },
    { value: 'continuous', icon: 'icon-scroll' },
  ];

  public fontFamilies = [
    'Helvetica',
    'Times New Roman',
    'Microsoft YaHei',
    'SimSun',
    'SimHei',
    'Arial',
  ];

  public lineHeights = ['1', '1.25', '1.5', '1.75', '2'];

  public settings: FormGroup;
  public controls: Controls = {};

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData
  ) {
    this.settings = fb.group({
      theme: new FormControl(data.theme),
      pageMode: new FormControl(data.pageMode),
      pageScale: new FormControl(data.pageScale),
      fontFamily: new FormControl(data.fontFamily),
      fontSize: new FormControl(data.fontSize),
      lineHeight: new FormControl(data.lineHeight),
    });

    this.controls = this.settings.controls as Controls;


    // this.settings.valueChanges.subscribe((value) => {
    //   console.log('valueChanges ->', value);
    // });

    // this.theme.valueChanges.subscribe((value) => {
    //   console.log('theme valueChanges ->', value);
    // });

    Object.keys(this.controls).forEach(key => {
      this.controls[key].valueChanges.subscribe(value => {
        console.log('value change', key, value);
        this.configService.setItem(`reader.${key}`, value);
      });
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
