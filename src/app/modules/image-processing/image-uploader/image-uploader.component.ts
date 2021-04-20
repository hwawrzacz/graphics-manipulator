import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  private _files: File[] = [];
  private _selectedFile?: File;

  @Output('fileSelected')
  private _fileLoadedEmitter = new EventEmitter<File>();

  get files(): File[] {
    return this._files;
  }

  constructor() { }

  ngOnInit(): void { }

  public onUpload(event: NgxDropzoneChangeEvent): void {
    this._files = event.addedFiles;
    this._selectedFile = this._files[0];
    this.emitSelectedFile();
  }

  public onSelect(event: MouseEvent, file: File): void {
    event.stopPropagation();

    this._selectedFile = this._files.find(f => f === file);
    this.emitSelectedFile();
  }

  private emitSelectedFile(): void {
    this._fileLoadedEmitter.emit(this._selectedFile);
  }

  public onRemove(file: File): void {
    this._files = this._files.filter(f => f === file);
    this._selectedFile = undefined;
    this.emitSelectedFile();
  }
}
