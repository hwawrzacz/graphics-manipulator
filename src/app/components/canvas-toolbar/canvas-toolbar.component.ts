import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingMode } from 'src/app/model/canvas-mode';
import { CanvasStateService } from 'src/app/services/canvas-state.service';
import { HelpComponent } from '../help/help.component';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss'],
  // Disabned encapsulation allows to apply custom tooltip class
  encapsulation: ViewEncapsulation.None,
})
export class CanvasToolbarComponent implements OnInit {
  constructor(private _canvasStateService: CanvasStateService, private _dialogService: MatDialog) { }

  //#region Getters and setters
  get isDrawingMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.DRAWING;
  }

  get isStraightLineMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.STRAIGHT_LINE;
  }

  get isRectangleMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.RECTANGLE;
  }

  get isCircleMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.CIRCLE;
  }

  get isEditMode(): boolean {
    return this._canvasStateService.drawingMode$.value === DrawingMode.EDIT;
  }
  //#endregion

  ngOnInit(): void { }

  public enableDrawingMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.DRAWING);
  }

  public enableStraightLineMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.STRAIGHT_LINE);
  }

  public enableRectangleMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.RECTANGLE);
  }

  public enableCircleMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.CIRCLE);
  }

  public enableEditMode(): void {
    this._canvasStateService.drawingMode$.next(DrawingMode.EDIT);
  }

  public clearCanvas(): void {
    this._canvasStateService.clear$.next();
  }

  public openHelpWindow(): void {
    this._dialogService.open(HelpComponent);
  }
}
