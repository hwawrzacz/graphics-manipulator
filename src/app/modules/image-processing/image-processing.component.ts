import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageDimensions } from 'src/app/model/image-dimensions';
import { Filter } from 'src/app/model/filter';
import { FilterPrintable } from 'src/app/model/filter-printable';
import { ImageProcessor } from './image-processor';

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

  private readonly _customFilters = [
    {
      value: Filter.CUSTOM_2x2,
      label: 'Custom 1'
    },
    {
      value: Filter.CUSTOM_3x3,
      label: 'Custom 2'
    },
  ];

  private readonly MAX_IMAGE_WIDTH = 450;
  private readonly MAX_IMAGE_HEIGHT = 500;
  private _canvasWidth = 450;
  private _canvasHeight = 500;
  private _isImageLoaded = false;
  private _form?: FormGroup;
  private _imageProcessor?: ImageProcessor;
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

  get customFilters(): FilterPrintable[] {
    return this._customFilters;
  }
  //#endregion

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._form = this.buildForm();
    this._imageProcessor = new ImageProcessor('canvasInput', 'canvasOutput');
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

  public onTransformImage(): void {
    const selectedFilter = this._form!.get('filter')!.value as Filter;

    if (!!this._imageProcessor) {
      this._imageProcessor.transformImage(selectedFilter);
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
