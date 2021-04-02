import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum AppModule {
  CANVAS = 'canvas',
  CONVERTER = 'converter',
}


@Injectable({
  providedIn: 'root'
})
export class RouterControllerService {
  get isCanvasModuleActive(): boolean {
    return this._router.url.split('/')[1] === AppModule.CANVAS;
  }

  get isConverterModuleActive(): boolean {
    return this._router.url.split('/')[1] === AppModule.CONVERTER;
  }

  constructor(private _router: Router) { }
}
