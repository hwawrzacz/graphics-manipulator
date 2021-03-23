import { CanvasLine } from 'src/app/model/canvas-line';
import { CanvasPoint } from 'src/app/model/canvas-point';
import { CanvasSnapshot } from 'src/app/model/canvas-snapshot';
import { CanvasStorage } from 'src/app/model/canvas-storage';
import { Point } from 'src/app/model/point';


/** Class that handles drawing logic */
export class DrawingManager {
  private _canvasStorage: CanvasStorage;

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
    this.strokeColor = p.color;
    this._contextPreview.beginPath();
    const startingX = p.x - Math.floor(p.width / 2);
    const startingY = p.y - Math.floor(p.width / 2);
    this._contextPreview.arc(startingX, startingY, p.width + Math.ceil(p.width * .3), 0, 2 * Math.PI);
    this._contextPreview.closePath();
    this._contextPreview.stroke();
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

  public drawLinePreview(line: CanvasLine): void {
    this.strokeColor = line.color;
    this.strokeWidth = line.width;
    this._contextPreview.moveTo(line.p1.x, line.p1.y);
    this._contextPreview.lineTo(line.p2.x, line.p2.y);
    this._contextPreview.stroke();
  }

  public clearCanvas(width: number, height: number): void {
    this._context?.clearRect(0, 0, width, height);
  }

  public clearCanvasPreview(width: number, height: number): void {
    this._contextPreview?.clearRect(0, 0, width, height);
    this._contextPreview?.beginPath();
  }

  public redrawFromSnapshot(snapshot: CanvasSnapshot): void {
    snapshot.straightLines.forEach(line => this.drawLine(line));
    snapshot.curvedLines.forEach(line => line.lines.forEach(subline => this.drawLine(subline)));
    snapshot.points.forEach(point => this.drawPoint(point));
  }

  public getLineByPoint(point: Point): CanvasLine | undefined {
    return this._canvasStorage.straightLines.find(line => !!line.path && this._context.isPointInStroke(line.path!, point.x, point.y));
  }

  public markLineForEdit(line: CanvasLine): void {
    const path = new Path2D();
    const p1: CanvasPoint = { ...line.p1, color: line.color, width: line.width };
    const p2: CanvasPoint = { ...line.p2, color: line.color, width: line.width };
    this.drawBoundaryCircle(p1);
    this.drawBoundaryCircle(p2);
  }
}