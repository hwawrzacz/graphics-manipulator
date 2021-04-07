import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';
import { ImageProcessingComponent } from '../../components/image-processing/image-processing.component';
import { ImageProcessingRoutingModule } from './image-processing-routing/image-processing-routing.module';

@NgModule({
  declarations: [FileUploaderComponent, ImageProcessingComponent],
  imports: [
    CommonModule,
    ImageProcessingRoutingModule
  ]
})
export class ImageProcessingModule { }
