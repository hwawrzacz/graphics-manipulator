import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';
import { ImageProcessingComponent } from '../../components/image-processing/image-processing.component';



@NgModule({
  declarations: [FileUploaderComponent, ImageProcessingComponent],
  imports: [
    CommonModule
  ]
})
export class ImageProcessingModule { }
