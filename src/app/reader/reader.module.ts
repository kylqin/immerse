import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BackgroundComponent } from './background/background.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { ReaderComponent } from './reader.component';
import { SettingsComponent } from './settings/settings.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NavigationComponent } from './navigation/navigation.component';
import { TocComponent } from './toc/toc.component';



@NgModule({
  declarations: [ReaderComponent, BackgroundComponent, SettingsComponent, ButtonsComponent, NavigationComponent, TocComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule
  ]
})
export class ReaderModule { }
