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
  //#endregion

  ngOnInit(): void { }

  public enableStraightLineMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.STRAIGHT_LINE);
  }

  public enableDrawingMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.DRAWING);
  }
}
