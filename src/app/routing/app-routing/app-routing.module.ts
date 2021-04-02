import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'canvas',
    component: CanvasComponent
  },
  {
    path: 'converter',
    component: CanvasComponent
  },
  {
    path: '',
    redirectTo: 'canvas',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'canvas',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
