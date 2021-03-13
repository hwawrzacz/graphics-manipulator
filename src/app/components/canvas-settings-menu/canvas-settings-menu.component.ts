import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasStateService, STROKE_SIZES } from 'src/app/services/canvas-state.service';

@Component({
  selector: 'app-canvas-settings-menu',
  templateUrl: './canvas-settings-menu.component.html',
  styleUrls: ['./canvas-settings-menu.component.scss']
})
export class CanvasSettingsMenuComponent implements OnInit, OnDestroy {
  strokeColor: string;
  strokeWidth: number;

  get allStrokeSizes(): number[] {
    return STROKE_SIZES;
  }

  constructor(private _canvasStateService: CanvasStateService) {
    this.strokeColor = _canvasStateService.strokeColor$.value;
    this.strokeWidth = _canvasStateService.strokeWidth$.value;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('saving');
    this.changeStrokeColor(this.strokeColor);
    this.changeStrokeWidth(this.strokeWidth);
  }

  private changeStrokeColor(color: string): void {
    this._canvasStateService.strokeColor$.next(color);
  }

  private changeStrokeWidth(width: number): void {
    this._canvasStateService.strokeWidth$.next(width);
  }

}
