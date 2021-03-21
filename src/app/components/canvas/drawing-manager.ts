import { CanvasLine } from 'src/app/model/canvas-line';
import { CanvasPoint } from 'src/app/model/canvas-point';
import { CanvasSnapshot } from 'src/app/model/canvas-snapshot';


/** Class that handles drawing logic */
export class DrawingManager {
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
  ) { }

  //#region Settings
  //#endregion

  public drawPoint(p: CanvasPoint): void {
    this.strokeColor = p.color;
    const startingX = p.x - Math.floor(p.width / 2);
    const startingY = p.y - Math.floor(p.width / 2);
    this._context.fillRect(startingX, startingY, p.width, p.width);
  }

  public drawLine(line: CanvasLine): void {
    this.strokeColor = line.color;
    this._context.beginPath();
    this._context.moveTo(line.p1.x, line.p1.y);
    this._context.lineTo(line.p2.x, line.p2.y);
    this._context.stroke();
    this._context.closePath();
  }

  public drawLinePreview(line: CanvasLine): void {
    this.strokeColor = line.color;
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

  }
}