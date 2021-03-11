import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

export interface Point {
  x: number;
  y: number;
}

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
  //#endregion

  constructor(private _renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!!this._canvas) {
      this._context = this._canvas.nativeElement.getContext('2d');
      this.initializeDrawingListener();
    }
  }

  // Mouse listeners
  private initializeDrawingListener() {
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
}
