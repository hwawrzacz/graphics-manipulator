import { CanvasLine } from 'src/app/model/canvas-line';
import { CanvasPoint } from 'src/app/model/canvas-point';
import { CanvasSnapshot } from 'src/app/model/canvas-snapshot';
import { CanvasStorage } from 'src/app/model/canvas-storage';
import { Point } from 'src/app/model/point';


/** Class that handles drawing logic */
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
  //#endregion
  constructor(
    private _context: CanvasRenderingContext2D,
    private _contextPreview: CanvasRenderingContext2D,
  ) {
    this._canvasStorage = new CanvasStorage();
  }

  //#region Settings
  //#endregion

  public drawPoint(p: CanvasPoint): void {
    this.strokeColor = p.color;
    const startingX = p.x - Math.floor(p.width / 2);
    const startingY = p.y - Math.floor(p.width / 2);
    this._context.fillRect(startingX, startingY, p.width, p.width);
  }

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

  public drawLine(line: CanvasLine, addToStorage = false): void {
    this.strokeColor = line.color;
    this.strokeWidth = line.width;
    if (!line.path) {
      line.path = new Path2D()
      line.path.moveTo(line.p1.x, line.p1.y);
      line.path.lineTo(line.p2.x, line.p2.y);
      line.path.closePath()
    }
    this._context.stroke(line.path);
    if (addToStorage) {
      this._canvasStorage.addStraightLine(line);
    }
  }

  public drawStraightLine(line: CanvasLine): void {
    this.drawLine(line, true);
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

  public drawLinePreview(line: CanvasLine): void {
    this.strokeColor = line.color;
    this.strokeWidth = line.width;
    this._contextPreview.beginPath();
    this._contextPreview.moveTo(line.p1.x, line.p1.y);
    this._contextPreview.lineTo(line.p2.x, line.p2.y);
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }

  public drawEditLinePreview(newPoint: Point): void {
    this.strokeColor = this._lineToEdit!.color;
    this.strokeWidth = this._lineToEdit!.width;
    this._contextPreview.beginPath();
    this._contextPreview.moveTo(this._editLineStaticPoint!.x, this._editLineStaticPoint!.y);
    this._contextPreview.lineTo(newPoint.x, newPoint.y);
    this._contextPreview.stroke();
    this._contextPreview.closePath();
  }

  public redrawCanvas(): void {
    const snapshot = this._canvasStorage.getSnapshot();
    this.uglyClearContext();
    this.redrawFromSnapshot(snapshot);
  }

  public clearCanvas(width: number, height: number): void {
    this._context?.clearRect(0, 0, width, height);
  }

  private uglyClearContext(): void {
    // TODO: Add clearing context in more civilised way. Drawing manager should pobably have access to canvas width and height.
    this._context.clearRect(0, 0, 10000, 10000);
  }

  private uglyClearContextPreview(): void {
    // TODO: Add clearing context in more civilised way. Drawing manager should pobably have access to canvas width and height.
    this._contextPreview.clearRect(0, 0, 10000, 10000);
  }

  public clearCanvasPreview(width: number, height: number): void {
    this._contextPreview?.clearRect(0, 0, width, height);
    this._contextPreview?.beginPath();
  }

  public removeEditedLineFromStorage(): void {
    if (!!this._lineToEdit) {
      this._canvasStorage.removeStraightLine(this._lineToEdit);
    }
  }

  public redrawFromSnapshot(snapshot: CanvasSnapshot): void {
    snapshot.straightLines.forEach(line => this.drawLine(line));
    snapshot.curvedLines.forEach(line => line.lines.forEach(subline => this.drawLine(subline)));
    snapshot.points.forEach(point => this.drawPoint(point));
  }

  public getLineByPoint(point: Point): CanvasLine | undefined {
    return this._canvasStorage.straightLines.find(line => !!line.path && this._context.isPointInStroke(line.path!, point.x, point.y));
  }

  public isInBoundaryPoint(point: Point): boolean {
    const isWithinBoundaryPoint1 = !!this._lineToEdit && this.distanceBetweenPoints(point, this._lineToEdit!.p1) <= this.boundaryPointDiameter(this._lineToEdit!.width);
    const isWithinBoundaryPoint2 = !!this._lineToEdit && this.distanceBetweenPoints(point, this._lineToEdit!.p2) <= this.boundaryPointDiameter(this._lineToEdit!.width);

    return isWithinBoundaryPoint1 || isWithinBoundaryPoint2;
  }

  public drawBoundaryPoints(line: CanvasLine): void {
    const p1: CanvasPoint = { ...line.p1, color: line.color, width: line.width };
    const p2: CanvasPoint = { ...line.p2, color: line.color, width: line.width };
    this.drawBoundaryCircle(p1);
    this.drawBoundaryCircle(p2);
  }

  public hideBoundaryPoints(): void {
    if (!this._lineToEdit) {
      this.uglyClearContextPreview();
    }
  }

  public selectLineForEdit(line: CanvasLine): void {
    this.onCancelEdit();
    this.drawBoundaryPoints(line);
    this._lineToEdit = this._canvasStorage.straightLines.find(ln => ln == line);
  }

  public onCancelEdit(): void {
    this.hideBoundaryPoints();
    this.uglyClearContextPreview();
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
}