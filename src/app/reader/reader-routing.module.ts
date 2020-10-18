import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReaderComponent } from './reader.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'reader',
    component: ReaderComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReaderRoutingModule { }
