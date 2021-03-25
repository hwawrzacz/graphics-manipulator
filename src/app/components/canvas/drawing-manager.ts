import { CanvasLine } from 'src/app/model/canvas-line';
import { CanvasPoint } from 'src/app/model/canvas-point';
import { CanvasRectangle } from 'src/app/model/canvas-rectangle';
import { CanvasSnapshot } from 'src/app/model/canvas-snapshot';
import { CanvasStorage } from 'src/app/model/canvas-storage';
import { Point } from 'src/app/model/point';


/** Class that handles drawing logic and canvas storage */
export class DrawingManager {
  private _canvasStorage: CanvasStorage;
  private _lineToEdit?: CanvasLine = undefined;
  private _editLineStaticPoint?: Point = undefined;

  //#region Getters and setters
  set strokeColor(strokeColor: string) {
    this._context!.fillStyle = strokeColor;
    this._context!.strokeStyle = strokeColor;
    this._contextPreview!.strokeStyle = strokeColor;
  }

  set strokeWidth(strokeSize: number) {
    this._context!.lineWidth = strokeSize;
    this._contextPreview!.lineWidth = strokeSize;
  }

  get strokeColor(): string {
    return this._context!.strokeStyle as string;
  }

  get strokeWidth(): number {
    return this._context!.lineWidth
  }
  //#endregion

  constructor(
    private _context: CanvasRenderingContext2D,
    private _contextPreview: CanvasRenderingContext2D,
  ) {
    this._canvasStorage = new CanvasStorage();
    this.strokeColor = '#373737';
    this.strokeWidth = 2;
  }

  //#region Point
  public drawPoint(p: CanvasPoint): void {
    this.strokeColor = p.color;
    const startingX = p.x - Math.floor(p.width / 2);
    const startingY = p.y - Math.floor(p.width / 2);
    this._context.fillRect(startingX, startingY, p.width, p.width);
  }
  //#endregion

  //#region Common line
  public drawSubline(p1: Point, p2: Point): void {
    this.strokeColor = this.strokeColor;
    this.strokeWidth = this.strokeWidth;
    const line = this.canvasLine(p1, p2);
    this._context.stroke(line.path!);
    this._canvasStorage.addCurvedLine(line);
  }
  //#endregion

  //#region Straght line
  public drawStraightLine(p1: Point, p2: Point): void {
    this.strokeColor = this.strokeColor;
    this.strokeWidth = this.strokeWidth;
    const line = this.canvasLine(p1, p2);
    this._context.stroke(line.path!);
    this._canvasStorage.addStraightLine(line);
  }

  /** Clears canvas preview and draws a preview of new line - the one passed as an argument.
   * 
   * @param line the line that should be drawn
   */
  public drawStraightLinePreview(p1: Point, p2: Point): void {
    this.clearCanvasPreview();

    this.strokeColor = this.strokeColor;
    this.strokeWidth = this.strokeWidth;
    this._contextPreview.beginPath();
    this._contextPreview.moveTo(p1.x, p1.y);
    this._contextPreview.lineTo(p2.x, p2.y);
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }
  //#endregion

  //#region Square

  public drawRectangle(p1: Point, p2: Point): void {
    this.strokeColor = this.strokeColor;
    this.strokeWidth = this.strokeWidth;
    const rectangle = this.createRectangle(p1, p2);
    this._context.stroke(rectangle.path!);
    this._canvasStorage.addRectangle(rectangle);
  }

  /** Clears canvas preview and draws a preview of new line - the one passed as an argument.
   * 
   * @param line the line that should be drawn
   */
  public drawRectanglePreview(p1: Point, p2: Point): void {
    this.clearCanvasPreview();

    this.strokeColor = this.strokeColor;
    this.strokeWidth = this.strokeWidth;
    this._contextPreview.beginPath();
    const rectangle = this.createRectangle(p1, p2);
    const width = rectangle.p1.x - rectangle.p2.x;
    const height = rectangle.p1.y - rectangle.p2.y;
    this._contextPreview.rect(rectangle.p2.x, rectangle.p2.y, width, height);
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }
  //#endregion

  //#region Edit straight line
  private drawBoundaryCircle(p: CanvasPoint): void {
    this._contextPreview.beginPath();
    this.strokeColor = p.color;
    const startingX = p.x - Math.floor(p.width / 2);
    const startingY = p.y - Math.floor(p.width / 2);
    this._contextPreview.arc(startingX, startingY, this.boundaryPointDiameter(p.width), 0, 2 * Math.PI);
    this._contextPreview.fillStyle = p.color;
    this._contextPreview.fill();
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }

  public drawEditedStraightLine(point: Point): void {
    const line = {
      p1: this._editLineStaticPoint,
      p2: point,
      color: this._lineToEdit!.color,
      width: this._lineToEdit!.width,
      path: new Path2D()
    } as CanvasLine;

    this.strokeColor = this._lineToEdit!.color;
    this.strokeWidth = this._lineToEdit!.width;
    line.path!.moveTo(this._editLineStaticPoint!.x, this._editLineStaticPoint!.y);
    line.path!.lineTo(point.x, point.y);
    line.path!.closePath();
    this._context.stroke(line.path!);

    this._canvasStorage.addStraightLine(line);
    this._lineToEdit = undefined;
    this._editLineStaticPoint = undefined;
  }

  /** Clears canvas preview and draws edited line preview. The line consists of two points: 
   * 
   * 1. Staic point - which was determined before
   * 2. New point - the one passed as an argument
   * 
   * @param newPoint new second point of edited line.
   */
  public drawEditLinePreview(newPoint: Point): void {
    this.clearCanvasPreview();
    this.removeEditedLineFromStorage();

    this.strokeColor = this._lineToEdit!.color;
    this.strokeWidth = this._lineToEdit!.width;
    this._contextPreview.beginPath();
    this._contextPreview.moveTo(this._editLineStaticPoint!.x, this._editLineStaticPoint!.y);
    this._contextPreview.lineTo(newPoint.x, newPoint.y);
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }
  //#endregion

  //#region Edit straight line visualizers
  public drawBoundaryPoints(line: CanvasLine): void {
    const p1: CanvasPoint = { ...line.p1, color: line.color, width: line.width };
    const p2: CanvasPoint = { ...line.p2, color: line.color, width: line.width };
    this.drawBoundaryCircle(p1);
    this.drawBoundaryCircle(p2);
  }

  public hideBoundaryPoints(): void {
    if (!this._lineToEdit) {
      this.clearCanvasPreview();
    }
  }
  //#endregion

  //#region Edit straight line helpers
  public selectLineForEdit(line: CanvasLine): void {
    this.onCancelCurrentLineEdit();
    this.drawBoundaryPoints(line);
    this._lineToEdit = this._canvasStorage.straightLines.find(ln => ln == line);
  }

  public onCancelCurrentLineEdit(): void {
    this.hideBoundaryPoints();
    this.clearCanvasPreview();
    this._lineToEdit = undefined;
  }

  public setDraggablePoint(point: Point): void {
    const dist1 = this.distanceBetweenPoints(point, this._lineToEdit!.p1);
    const dist2 = this.distanceBetweenPoints(point, this._lineToEdit!.p2);

    this._editLineStaticPoint = dist1 > dist2 ? this._lineToEdit!.p1 : this._lineToEdit!.p2;
  }

  private distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.abs(Math.hypot(p1.x - p2.x, p1.y - p2.y));
  }

  private boundaryPointDiameter(strokeWidth: number): number {
    return Math.max(strokeWidth + Math.ceil(strokeWidth * .3), 5);
  }

  public isInBoundaryPoint(point: Point): boolean {
    const isWithinBoundaryPoint1 = !!this._lineToEdit && this.distanceBetweenPoints(point, this._lineToEdit!.p1) <= this.boundaryPointDiameter(this._lineToEdit!.width);
    const isWithinBoundaryPoint2 = !!this._lineToEdit && this.distanceBetweenPoints(point, this._lineToEdit!.p2) <= this.boundaryPointDiameter(this._lineToEdit!.width);

    return isWithinBoundaryPoint1 || isWithinBoundaryPoint2;
  }
  //#endregion

  //#region Canvas editors
  public redrawCanvas(): void {
    const snapshot = this._canvasStorage.getSnapshot();
    this.clearCanvas();
    this.redrawFromSnapshot(snapshot);
  }

  public clearCanvas(clearStorage = false): void {
    this._contextPreview.closePath();
    this._context.clearRect(0, 0, 10000, 10000);

    if (clearStorage) {
      this._canvasStorage.clearStorage();
    }
  }

  public redrawFromSnapshot(snapshot: CanvasSnapshot): void {
    snapshot.straightLines.forEach(line => this.drawStraightLine(line.p1, line.p2));
    snapshot.rectangles.forEach(rect => this.drawRectangle(rect.p1, rect.p2));
    snapshot.curvedLines.forEach(line => this.drawSubline(line.p1, line.p2));
    snapshot.points.forEach(point => this.drawPoint(point));
  }

  public clearCanvasPreview(): void {
    this._contextPreview.closePath();
    this._contextPreview.clearRect(0, 0, 10000, 10000);
  }
  //#endregion

  //#region Storage management
  public removeEditedLineFromStorage(): void {
    if (!!this._lineToEdit) {
      this._canvasStorage.removeStraightLine(this._lineToEdit);
    }
  }
  //#endregion

  //#region Misc  
  public getLineByPoint(point: Point): CanvasLine | undefined {
    console.log(this._canvasStorage.straightLines);
    return this._canvasStorage.straightLines.find(line => !!line.path && this._context.isPointInStroke(line.path!, point.x, point.y));
  }
  //#endregion

  // TODO: Create classes for below interfaces
  //#region Future classes
  // CanvasRectangle
  private createRectangle(p1: Point, p2: Point): CanvasRectangle {
    const rect = {
      p1: p1,
      p2: p2,
      color: this.strokeColor,
      width: this.strokeWidth
    } as CanvasRectangle;
    rect.path = this.createRectanglePath(rect);

    return rect;
  }

  /** Returns the path made out of the rectangle. If the passed rectangle already has a path, then this existing path is being returned */
  private createRectanglePath(rectangle: CanvasRectangle): Path2D {
    if (!rectangle.path) {
      const path = new Path2D();
      const width = rectangle.p1.x - rectangle.p2.x;
      const height = rectangle.p1.y - rectangle.p2.y;
      path.rect(rectangle.p2.x, rectangle.p2.y, width, height);
      path.closePath();

      return path;
    }
    else {
      return rectangle.path;
    }
  }

  // CanvasLine
  private canvasLine(p1: Point, p2: Point): CanvasLine {
    const line = {
      p1: p1,
      p2: p2,
      color: this.strokeColor,
      width: this.strokeWidth
    } as CanvasLine;
    line.path = this.createLinePath(line);

    return line;
  }

  /** Returns the path made out of the line. If the passed line already has a path, then this existing path is being returned */
  private createLinePath(line: CanvasLine): Path2D {
    if (!line.path) {
      const path = new Path2D();
      path.moveTo(line.p1.x, line.p1.y);
      path.lineTo(line.p2.x, line.p2.y);
      path.closePath();

      return path;
    }
    else {
      return line.path;
    }
  }
  //#endregion
}