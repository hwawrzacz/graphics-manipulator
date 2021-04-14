import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as cv from '@techstark/opencv-js'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export enum Filter {
  GRAYSCALE,
}

export interface PrintableFilter {
  value: Filter;
  label: string;
}

@Component({
  selector: 'app-image-processing',
  templateUrl: './image-processing.component.html',
  styleUrls: ['./image-processing.component.scss']
})
export class ImageProcessingComponent implements OnInit {
  private readonly availableFilters = [
    {
      value: Filter.GRAYSCALE,
      label: 'Gray scale'
    },
  ]

  private _isImageLoaded = false;
  private _form?: FormGroup;
  @ViewChild('canvasInput') private _canvasInput?: ElementRef<HTMLCanvasElement>;

  //#region Getters and setters
  get form(): FormGroup {
    return this._form!;
  }

  get isImageLoaded(): boolean {
    return this._isImageLoaded;
  }

  get filters(): PrintableFilter[] {
    return this.availableFilters;
  }
  //#endregion

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      filter: [Filter.GRAYSCALE, [Validators.required]]
    })
  }

  public loadFile(file: File): void {
    this._isImageLoaded = false;

    if (!file) return;

    const image = new Image();
    const reader = new FileReader();

    fromEvent(reader, 'load').pipe(
      filter(result => !!result),
      map((event: Event) => (event.target as FileReader).result as string),
      switchMap(imageUrl => {
        image.src = imageUrl;
        return fromEvent(image, 'load');
      }),
      tap(() => this.drawImageToCanvas(image))
    ).subscribe();

    reader.readAsDataURL(file);
  }

  private drawImageToCanvas(image: HTMLImageElement): void {
    const ctx = this._canvasInput?.nativeElement.getContext('2d');
    ctx!.drawImage(image, 0, 0);
    this._isImageLoaded = true;
  }

  public applyFilter(): void {
    const source = cv.imread('canvasInput');
    const destination = new cv.Mat();
    const filter = this.getSelectedFilter();
    cv.cvtColor(source, destination, filter, 0);
    cv.imshow('canvasOutput', destination);
    source.delete();
    destination.delete();
  }

  private getSelectedFilter(): cv.ColorConversionCodes {
    const filter = this._form!.get('filter')!.value as Filter;

    switch (filter) {
      case Filter.GRAYSCALE: return cv.COLOR_RGB2GRAY;
      default: return cv.COLOR_RGB2Luv;
    }
  }
}
