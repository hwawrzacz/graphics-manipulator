import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DrawingMode } from 'src/app/model/canvas-mode';
import { Point } from 'src/app/model/point';
import { CanvasStateService } from 'src/app/services/canvas-state.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  private _context?: CanvasRenderingContext2D | null;
  private _contextPreview?: CanvasRenderingContext2D | null;
  private _prevPoint?: Point;
  private _drawing = false;
  private _drawingModeChange$ = new Subject();

  @ViewChild('canvas')
  private _canvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasPreview')
  private _canvasPreview?: ElementRef<HTMLCanvasElement>;

  // Config
  private _width: number = 500;
  private _height: number = 300;

  //#region Getters and setters
  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get drawingMode(): DrawingMode {
    return this._canvasStateService.drawingMode$.value;
  }

  get strokeSize(): number {
    return this._canvasStateService.strokeWidth$.value;
  };
  get strokeColor(): string {
    return this._canvasStateService.strokeColor$.value;
  };
  //#endregion

  constructor(private _canvasStateService: CanvasStateService, private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    try {
      this.initializeContexts();
      this.observeDrawingModeChange();
      this.observeCanvasClear();
      this.observeSettingsChanges();
    } catch (exc) {
      this.openSnackBar(`Canvas were not initalized properly. Please try to reload the page`);
    }
  }

  private initializeContexts(): void {
    this._context = this._canvas!.nativeElement.getContext('2d');
    this._contextPreview = this._canvasPreview!.nativeElement.getContext('2d');
  }

  private setStrokeColor(strokeColor: string): void {
    this._context!.strokeStyle = strokeColor;
    this._contextPreview!.strokeStyle = strokeColor;
  }

  private setStrokeWidth(strokeSize: number): void {
    this._context!.lineWidth = strokeSize;
    this._contextPreview!.lineWidth = strokeSize;
  }

  private observeDrawingModeChange(): void {
    this._canvasStateService.drawingMode$
      .pipe(
        tap(mode => {
          this._drawingModeChange$.next();
          this.switchMode(mode);
        })
      ).subscribe();
  }

  private observeSettingsChanges(): void {
    this._canvasStateService.strokeColor$.pipe(tap(color => this.setStrokeColor(color))).subscribe();
    this._canvasStateService.strokeWidth$.pipe(tap(width => this.setStrokeWidth(width))).subscribe();
  }

  private switchMode(mode: DrawingMode): void {
    switch (mode) {
      case DrawingMode.DRAWING:
        this.initializeDrawingListener();
        break;

      case DrawingMode.STRAIGHT_LINE:
        this.initializeStraightLineListener();
        break;

      default:
        this.openSnackBar('Selected mode is not supported yet');
    }
  }

  private observeCanvasClear(): void {
    this._canvasStateService.clear$
      .pipe(
        tap(() => {
          this.clearCanvas();
          this.clearCanvasPreview();
          this.clearPreviousPoint()
        })
      ).subscribe();
  }

  //#region Mouse listeners
  private initializeDrawingListener() {
    fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousedown')
      .pipe(
        tap(e => this.onDrawPoint(e)),
        switchMap(() => fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousemove')
          .pipe(
            tap(() => this._drawing = true),
            takeUntil(fromEvent<MouseEvent>(document, 'mouseup')
              .pipe(
                tap(e => this.onMouseUp(e)),
              )))
        ),
        tap(e => this.onDrawLine(e)),
        takeUntil(this._drawingModeChange$)
      )
      .subscribe();
  }

  private initializeStraightLineListener(): void {
    fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousedown')
      .pipe(
        tap(e => this.assingPreviousPointFromEvent(e)),
        switchMap(() => fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousemove')
          .pipe(
            takeUntil(fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mouseup')
              .pipe(
                tap(e => this.onStraightLineMouseUp(e)),
              )))
        ),
        tap(e => this.onDrawLinePreview(e)),
        takeUntil(this._drawingModeChange$)
      )
      .subscribe();
  }
  //#endregion

  private onMouseUp(event: MouseEvent): void {
    this._drawing = false;
    const newPoint = { x: event.offsetX, y: event.offsetY };

    if (event.shiftKey) {
      this.drawLine(this._prevPoint!, newPoint);
    }

    this._context!.closePath();
  }

  private onStraightLineMouseUp(event: MouseEvent): void {
    const newPoint = { x: event.offsetX, y: event.offsetY };
    this.drawLine(this._prevPoint!, newPoint);
    if (!this._drawing) {
      this.assingPreviousPointFromPoint(newPoint);
    }
    this._context!.closePath();
    this.clearCanvasPreview();
  }

  private onDrawPoint(event: MouseEvent): void {
    const newPoint = { x: event.offsetX, y: event.offsetY };

    event.shiftKey && this._prevPoint
      ? this.drawLine(this._prevPoint, newPoint)
      : this.drawPoint(newPoint)

    this._prevPoint = { x: newPoint.x, y: newPoint.y };
  }

  private drawPoint(p1: Point): void {
    const startingX = p1.x - Math.floor(this.strokeSize / 2);
    const startingY = p1.y - Math.floor(this.strokeSize / 2);
    this._context?.fillRect(startingX, startingY, this.strokeSize, this.strokeSize);
  }

  private drawLine(p1: Point, p2: Point): void {
    this._context!.beginPath();
    this._context!.moveTo(p1.x, p1.y);
    this._context!.lineTo(p2.x, p2.y);
    this._context!.stroke();
  }

  private drawLinePreview(p1: Point, p2: Point): void {
    this._contextPreview!.moveTo(p1.x, p1.y);
    this._contextPreview!.lineTo(p2.x, p2.y);
    this._contextPreview!.stroke();
  }

  private onDrawLine(event: MouseEvent): void {
    const newPoint = { x: event.offsetX, y: event.offsetY };
    if (!this._prevPoint) {
      this.assingPreviousPointFromPoint(newPoint);
    }

    if (event.shiftKey) {
      console.log('shift');
    } else {
      this.drawLine(this._prevPoint!, newPoint);
    }

    this.assingPreviousPointFromPoint(newPoint);
  }

  private onDrawLinePreview(event: MouseEvent): void {
    this.clearCanvasPreview();
    const newPoint = { x: event.offsetX, y: event.offsetY };
    this.drawLinePreview(this._prevPoint!, newPoint);
  }

  private clearCanvas(): void {
    this._context?.clearRect(0, 0, this._width, this._height);
  }

  private clearCanvasPreview(): void {
    this._contextPreview?.clearRect(0, 0, this._width, this._height);
    this._contextPreview?.beginPath();
  }

  private clearPreviousPoint() {
    this._prevPoint = undefined;
  }

  private assingPreviousPointFromEvent(event: MouseEvent): void {
    this._prevPoint = { x: event.offsetX, y: event.offsetY };
  }

  private assingPreviousPointFromPoint(point: Point): void {
    this._prevPoint = { x: point.x, y: point.y };
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, undefined, { duration: 3000 });
  }
}
