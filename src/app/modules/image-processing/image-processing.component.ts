import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as cv from '@techstark/opencv-js'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageDimensions } from 'src/app/model/image-dimensions';
import { Filter, FilterCategory } from 'src/app/model/filter';
import { FilterPrintable } from 'src/app/model/filter-printable';

@Component({
  selector: 'app-image-processing',
  templateUrl: './image-processing.component.html',
  styleUrls: ['./image-processing.component.scss']
})
export class ImageProcessingComponent implements OnInit {
  private readonly _blurFiltes = [
    {
      value: Filter.BLUR_3X3,
      label: 'Slightly soft'
    },
    {
      value: Filter.BLUR_7X7,
      label: 'Medium soft'
    },
    {
      value: Filter.BLUR_14x14,
      label: 'Very soft'
    },
  ];

  private readonly _colorFilters = [
    {
      value: Filter.NONE,
      label: 'None'
    },
    {
      value: Filter.GRAYSCALE,
      label: 'Gray scale'
    },
    {
      value: Filter.LUV,
      label: 'Luv palette'
    },
  ];

  private readonly MAX_IMAGE_WIDTH = 450;
  private readonly MAX_IMAGE_HEIGHT = 500;
  private _canvasWidth = 450;
  private _canvasHeight = 500;
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

  get canvasDimensions(): ImageDimensions {
    return { width: this._canvasWidth, height: this._canvasHeight };
  }

  get colorFilters(): FilterPrintable[] {
    return this._colorFilters;
  }

  get blurFilters(): FilterPrintable[] {
    return this._blurFiltes;
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
    const imageDimensions = { width: image.width, height: image.height };
    const newImageDimensions = this.getMaxImageDimensionsToFitCanvas(imageDimensions);
    this._canvasWidth = newImageDimensions.width;
    this._canvasHeight = newImageDimensions.height;
    setTimeout(() => ctx!.drawImage(image, 0, 0, this._canvasWidth, this._canvasHeight));
    this._isImageLoaded = true;
  }

  public transformImage(): void {
    const source = cv.imread('canvasInput');
    const destination = new cv.Mat();
    const selectedFilter = this._form!.get('filter')!.value as Filter;
    this.handleFilterDependingOnCategory(selectedFilter, source, destination);
    source.delete();
    destination.delete();
  }

  private handleFilterDependingOnCategory(filter: Filter, source: cv.Mat, destination: cv.Mat): void {
    const filterCategory = this.getFilterCategory(filter);
    switch (filterCategory) {
      case FilterCategory.BLUR:
        this.applyBlurFilter(filter, source, destination)
        break;
      case FilterCategory.COLOR:
        this.applyColorFilter(filter, source, destination);
        break;
      default:
      // Handle filter error 
    }
  }

  private getFilterCategory(filter: Filter): FilterCategory {
    switch (filter) {
      case Filter.BLUR_3X3:
      case Filter.BLUR_7X7:
      case Filter.BLUR_14x14: return FilterCategory.BLUR;

      case Filter.NONE:
      case Filter.LUV:
      case Filter.GRAYSCALE: return FilterCategory.COLOR;

      default: return FilterCategory.UNKNOWN;
    }
  }

  private applyBlurFilter(filter: Filter, src: cv.Mat, dst: cv.Mat): void {
    const kernelSize = this.getBlurSize(filter);
    const anchor = new cv.Point(-1, -1);
    const border = cv.BORDER_DEFAULT;
    const ddepth = -1; // -1 will make destination image depth the same as source depth
    cv.blur(src, dst, kernelSize, anchor, border);
    cv.imshow('canvasOutput', dst);
  }

  /** Returns size depending on given blur filter 
   * @param filter - blur filter
   * 
   * @returns cv.Size. If given filter is not blur filter it will return Size(1, 1)
  */
  private getBlurSize(filter: Filter): cv.Size {
    switch (filter) {
      case Filter.BLUR_3X3: return new cv.Size(3, 3);
      case Filter.BLUR_7X7: return new cv.Size(7, 7);
      case Filter.BLUR_14x14: return new cv.Size(14, 14);
      default: return new cv.Size(1, 1);
    }
  }

  private applyColorFilter(filter: Filter, src: cv.Mat, dst: cv.Mat): void {
    const filterCode = this.getFilterCode(filter);
    cv.cvtColor(src, dst, filterCode, 0);
    cv.imshow('canvasOutput', dst);
  }

  private getFilterCode(filter: Filter): cv.ColorConversionCodes {
    switch (filter) {
      case Filter.GRAYSCALE: return cv.COLOR_RGB2GRAY;
      case Filter.LUV: return cv.COLOR_RGB2Luv;
      case Filter.NONE: return cv.COLOR_RGB2RGBA;
      default: return cv.COLOR_RGB2RGBA;
    }
  }

  //#region Helpers
  private getMaxImageDimensionsToFitCanvas(imageDimensions: ImageDimensions): ImageDimensions {
    const [maxCanvasWidth, maxCanvasHeight] = [450, 500];
    const [imageWidth, imageHeight] = [imageDimensions.width, imageDimensions.height];
    const canvasRatio = maxCanvasWidth / maxCanvasHeight;
    const imageRatio = imageWidth / imageHeight;

    let newImageWidth: number;
    let newImageHeight: number;


    // If image is wider than canvas
    if (imageRatio > canvasRatio) {
      newImageWidth = maxCanvasWidth;
      const imageScale = newImageWidth / imageWidth;
      newImageHeight = imageHeight * imageScale;
    } else {
      newImageHeight = maxCanvasHeight;
      const imageScale = maxCanvasWidth / imageHeight;
      newImageWidth = imageWidth * imageScale;
    }

    return { width: newImageWidth, height: newImageHeight };
  }
  //#endregion
}
