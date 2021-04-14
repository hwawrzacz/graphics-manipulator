import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ImageProcessingComponent } from './image-processing.component';
import { ImageProcessingRoutingModule } from './image-processing-routing/image-processing-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonMaterialModule } from '../common-material/common-material.module';

@NgModule({
  declarations: [ImageUploaderComponent, ImageProcessingComponent],
  imports: [
    CommonModule,
    CommonMaterialModule,
    ImageProcessingRoutingModule,
    NgxDropzoneModule,
  ]
})
export class ImageProcessingModule { }
