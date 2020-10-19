import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderComponent } from './reader.component';
import { BackgroundComponent } from './background/background.component';
@NgModule({
  declarations: [ReaderComponent, BackgroundComponent],
  imports: [
    CommonModule
  ]
})
export class ReaderModule { }
