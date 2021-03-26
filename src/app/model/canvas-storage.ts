import { CanvasLine } from './canvas-line';
import { CanvasPoint } from './canvas-point';
import { CanvasRectangle } from './canvas-rectangle';
import { CanvasSnapshot } from './canvas-snapshot';
import { CanvasEllipse } from './ellipse';

export class CanvasStorage {
  private _straightLines: CanvasLine[] = [];
  private _curvedLines: CanvasLine[] = [];
  private _rectangles: CanvasRectangle[] = [];
  private _ellipses: CanvasEllipse[] = [];
  private _points: CanvasPoint[] = [];

  //#region Getters and setters
  get straightLines(): CanvasLine[] {
    return this._straightLines;
  }

  get rectangles(): CanvasRectangle[] {
    return this._rectangles;
  }
  //#endregion
  constructor() { }

  //#region Straight lines
  public addStraightLine(line: CanvasLine): void {
    this._straightLines.push(line);
  }

  public removeStraightLine(lineToDelete: CanvasLine): void {
    this._straightLines = this._straightLines.filter(line => !this.areLinesIdentical(line, lineToDelete));
  }
  //#endregion

  //#region Rectangles
  public addRectangle(rectangle: CanvasRectangle): void {
    this._rectangles.push(rectangle);
  }

  public removeRectangle(rectangleToDelete: CanvasRectangle): void {
    this._rectangles = this._rectangles.filter(rect => !this.areRectanglesIdentical(rect, rectangleToDelete));
  }
  //#endregion

  //#region Ellipses
  public addEllipse(ellipse: CanvasEllipse): void {
    this._ellipses.push(ellipse);
  }

  public removeEllipse(ellipseToDelete: CanvasEllipse): void {
    this._ellipses = this._ellipses.filter(ellipse => !this.areEllipsesIdentical(ellipse, ellipseToDelete));
  }
  //#endregion

  //#region Curved lines
  public addCurvedLine(line: CanvasLine): void {
    this._curvedLines.push(line);
  }
  //#endregion

  //#region Points
  public addPoint(point: CanvasPoint): void {
    this._points.push(point);
  }
  //#endregion

  //#region Storage management
  private print(): void {
    const snapshot = {
      points: this._points,
      curvedLines: this._curvedLines,
      straightLines: this._straightLines,
      rectangles: this._rectangles,
    } as CanvasSnapshot;

    console.log(snapshot);
  }

  public getSnapshot(): CanvasSnapshot {
    const snapshot = {
      points: this._points,
      curvedLines: this._curvedLines,
      straightLines: this._straightLines,
      rectangles: this._rectangles,
      ellipses: this._ellipses,
    } as CanvasSnapshot;

    return snapshot;
  }

  public clearStorage(): void {
    this._points = [];
    this._curvedLines = [];
    this._straightLines = [];
    this._rectangles = [];
    this._ellipses = [];
  }
  //#endregion

  //#region Helpers
  public areLinesIdentical(l1: CanvasLine, l2: CanvasLine): boolean {
    return (
      l1.color === l2.color &&
      l1.width === l2.width &&
      l1.p1.x === l2.p1.x &&
      l1.p1.y === l2.p1.y &&
      l1.p2.x === l2.p2.x &&
      l1.p2.y === l2.p2.y
    );
  }

  public areRectanglesIdentical(r1: CanvasRectangle, r2: CanvasRectangle): boolean {
    return (
      r1.color === r2.color &&
      r1.strokeWidth === r2.strokeWidth &&
      r1.p1.x === r2.p1.x &&
      r1.p1.y === r2.p1.y &&
      r1.p2.x === r2.p2.x &&
      r1.p2.y === r2.p2.y
    );
  }

  public areEllipsesIdentical(el1: CanvasEllipse, el2: CanvasEllipse): boolean {
    return (
      el1.color === el2.color &&
      el1.strokeWidth === el2.strokeWidth &&
      el1.p1.x === el2.p1.x &&
      el1.p1.y === el2.p1.y &&
      el1.p2.x === el2.p2.x &&
      el1.p2.y === el2.p2.y
    );
  }
  //#endregion
}