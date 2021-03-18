import { Point } from 'src/app/model/point';

export class DrawingManager {
  //#region Getters and setters
  set strokeColor(strokeColor: string) {
    this._color
    this._context!.fillStyle = strokeColor;
    this._context!.strokeStyle = strokeColor;
    this._contextPreview!.strokeStyle = strokeColor;
  }

  set strokeWidth(strokeSize: number) {
    this._context!.lineWidth = strokeSize;
    this._contextPreview!.lineWidth = strokeSize;
  }
  //#endregion
  constructor(private _context: any, private _contextPreview: any, private _color: string, private _strokeSize: number,) { }

  //#region Settings
  //#endregion

  public drawPoint(p: Point): void {
    const startingX = p.x - Math.floor(this._strokeSize / 2);
    const startingY = p.y - Math.floor(this._strokeSize / 2);
    this._context.fillRect(startingX, startingY, this._strokeSize, this._strokeSize);
  }

  public drawLine(p1: Point, p2: Point): void {
    this._context.beginPath();
    this._context.moveTo(p1.x, p1.y);
    this._context.lineTo(p2.x, p2.y);
    this._context.stroke();
  }

  public drawLinePreview(p1: Point, p2: Point): void {
    this._contextPreview.moveTo(p1.x, p1.y);
    this._contextPreview.lineTo(p2.x, p2.y);
    this._contextPreview.stroke();
  }

  public clearCanvas(width: number, height: number): void {
    this._context?.clearRect(0, 0, width, height);
  }

  public clearCanvasPreview(width: number, height: number): void {
    this._contextPreview?.clearRect(0, 0, width, height);
    this._contextPreview?.beginPath();
  }
}