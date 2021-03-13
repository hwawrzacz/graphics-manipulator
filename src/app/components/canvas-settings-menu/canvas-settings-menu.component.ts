import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasStateService, STROKE_SIZES } from 'src/app/services/canvas-state.service';

@Component({
  selector: 'app-canvas-settings-menu',
  templateUrl: './canvas-settings-menu.component.html',
  styleUrls: ['./canvas-settings-menu.component.scss']
})
export class CanvasSettingsMenuComponent {
  strokeColor: string;
  strokeWidth: number;

  get allStrokeSizes(): number[] {
    return STROKE_SIZES;
  }

  constructor(private _canvasStateService: CanvasStateService) {
    this.strokeColor = this._canvasStateService.strokeColor$.value;
    this.strokeWidth = this._canvasStateService.strokeWidth$.value;
  }

  public changeStrokeColor(color: string): void {
    this._canvasStateService.strokeColor$.next(color);
  }

  public changeStrokeWidth(width: number): void {
    this._canvasStateService.strokeWidth$.next(width);
  }

}
