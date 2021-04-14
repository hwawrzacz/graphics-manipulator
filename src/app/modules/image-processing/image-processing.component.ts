import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as cv from '@techstark/opencv-js'

export enum Filter {
  GRAYSCALE,
}

@Component({
  selector: 'app-image-processing',
  templateUrl: './image-processing.component.html',
  styleUrls: ['./image-processing.component.scss']
})
export class ImageProcessingComponent implements OnInit {
  @ViewChild('canvasInput') private _canvasInput?: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasOutput') private _canvasOutput?: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void { }

  public loadFile(file: File): void {
    console.log(file);
    const image = new Image();
    const reader = new FileReader();

    fromEvent(reader, 'load').pipe(
      filter(result => !!result),
      map((event: Event) => (event.target as FileReader).result as string),
      switchMap(imageUrl => {
        image.src = imageUrl;
        return fromEvent(image, 'load');
      }),
      tap(() => {
        this.drawImageToCanvas(image);
      })
    ).subscribe();

    reader.readAsDataURL(file);
  }

  private drawImageToCanvas(image: HTMLImageElement): void {
    const ctx = this._canvasInput?.nativeElement.getContext('2d');
    ctx!.drawImage(image, 0, 0);
  }

  public applyFilter(): void {
    const source = cv.imread('canvasInput');
    const destination = new cv.Mat();
    const filter = this.getSelectedFilter();
    cv.cvtColor(source, destination, cv.COLOR_RGB2GRAY, 0);
    cv.imshow('canvasOutput', destination);
    source.delete(); destination.delete();
  }

  private getSelectedFilter(): cv.ColorConversionCodes {
    // const filter = this._filter;
    const filter = Filter.GRAYSCALE;

    switch (filter) {
      case Filter.GRAYSCALE: return cv.COLOR_RGB2GRAY;
      default: return cv.COLOR_RGB2Luv;
    }
  }
}
