import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryRoutingModule } from './library/library-routing.module';
import { ReaderRoutingModule } from './reader/reader-routing.module';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LibraryRoutingModule,
    ReaderRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
