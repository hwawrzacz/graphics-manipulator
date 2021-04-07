import { Component, OnInit } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  private _files: File[] = [];

  get files(): File[] {
    return this._files;
  }

  constructor() { }

  ngOnInit(): void {
  }

  public onUpload(event: NgxDropzoneChangeEvent): void {
    this._files = event.addedFiles;
  }

  public onSelect(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    console.log('selected');
  }
}
