import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ImageProcessingComponent } from 'src/app/modules/image-processing/image-processing/image-processing.component';

const routes: Routes = [
  {
    path: '',
    component: ImageProcessingComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ImageProcessingRoutingModule { }
