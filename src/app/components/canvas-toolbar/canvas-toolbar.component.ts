import { Component, OnInit } from '@angular/core';
import { DrawingMode } from 'src/app/model/canvas-mode';
import { CanvasStateService } from 'src/app/services/canvas-state.service';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss']
})
export class CanvasToolbarComponent implements OnInit {
  constructor(private _canvasStateService: CanvasStateService) { }

  //#region Getters and setters
  get isDrawingMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.DRAWING;
  }

  get isStraightLineMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.STRAIGHT_LINE;
  }

  get isSquareMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.SQUARE;
  }

  get isCircleMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.CIRCLE;
  }
  //#endregion

  ngOnInit(): void { }

  public enableDrawingMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.DRAWING);
  }

  public enableStraightLineMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.STRAIGHT_LINE);
  }

  public enableSquareMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.SQUARE);
  }

  public enableCircleMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.CIRCLE);
  }
}
