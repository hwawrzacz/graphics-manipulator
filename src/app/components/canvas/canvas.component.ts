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
export class CanvasComponent implements OnInit, AfterViewInit {
  private _width: number = 500;
  private _height: number = 300;
  private _context?: CanvasRenderingContext2D | null;
  private _prevPoint?: Point;
  private _moving = false;
  private _drawingModeChange$ = new Subject();

  @ViewChild('canvas')
  private _canvas?: ElementRef<HTMLCanvasElement>;

  // Config
  private _brushSize = 2;

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
  //#endregion

  constructor(private _canvasStateService: CanvasStateService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.observeDrawingModeChange();
    this.observeCanvasClear();
  }

  private observeDrawingModeChange(): void {
    this._canvasStateService.drawingMode$
      .pipe(
        filter(() => !!this._canvas),
        tap(mode => {
          this._drawingModeChange$.next();
          this.switchMode(mode);
        })
      ).subscribe();
  }

  private switchMode(mode: DrawingMode): void {
    switch (mode) {
      case DrawingMode.DRAWING:
        this._context = this._canvas!.nativeElement.getContext('2d');
        this.initializeDrawingListener();
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
          this.clearPreviousPoint()
        })
      ).subscribe();
  }

  // Mouse listeners
  private initializeDrawingListener() {
    this.openSnackBar('Drawing initialized');

    fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousedown')
      .pipe(
        tap(e => this.onDrawPoint(e)),
        switchMap(() => fromEvent<MouseEvent>(this._canvas?.nativeElement!, 'mousemove')
          .pipe(
            tap(() => this._moving = true),
            takeUntil(fromEvent<MouseEvent>(document, 'mouseup')
              .pipe(
                tap(() => this._moving = false),
                tap(e => this.onMouseUp(e)),
              )))
        ),
        tap(e => this.onDrawLine(e)),
        takeUntil(this._drawingModeChange$)
      )
      .subscribe();
  }

  private onMouseUp(event: MouseEvent): void {
    const newPoint = { x: event.offsetX, y: event.offsetY };

    if (event.shiftKey) {
      this.drawLine(this._prevPoint!, newPoint);
    } else if (this._moving) {
      this.clearPreviousPoint();
    }
  }

  private onDrawPoint(event: MouseEvent): void {
    const newPoint = { x: event.offsetX, y: event.offsetY };

    if (event.shiftKey && this._prevPoint) {
      // console.log('shift');
      this.drawLine(this._prevPoint, newPoint);
    } else {
      this.drawPoint(newPoint);
    }
    this._prevPoint = { x: newPoint.x, y: newPoint.y };
  }

  private drawPoint(p1: Point): void {
    this._context?.fillRect(p1.x, p1.y, this._brushSize, this._brushSize);
  }

  private drawLine(p1: Point, p2: Point): void {
    this._context!.moveTo(p1.x, p1.y);
    this._context!.lineTo(p2.x, p2.y);
    this._context!.stroke();
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

  private clearCanvas(): void {
    this._context?.clearRect(0, 0, this._width, this._height);
  }

  private clearPreviousPoint() {
    // console.log('point cleared');
    this._prevPoint = undefined;
  }

  private assingPreviousPointFromEvent(event: MouseEvent): void {
    // console.log('point reassigned form event');
    this._prevPoint = { x: event.offsetX, y: event.offsetY };
  }

  private assingPreviousPointFromPoint(point: Point): void {
    // console.log('point reassigned form point');
    this._prevPoint = { x: point.x, y: point.y };
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, undefined, { duration: 3000 });
  }
}
