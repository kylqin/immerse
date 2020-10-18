import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReaderRoutingModule } from './reader/reader-routing.module';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReaderRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
