import { CanvasLine } from './canvas-line';

/** Curved line, which contains a set of sublines */
export class CurvedLine {
  //#region Getters and setters
  get lines(): CanvasLine[] {
    return this._lines;
  }
  set lines(value: CanvasLine[]) {
    this._lines = value;
  }
  //#endregion

  constructor(private _lines: CanvasLine[] = []) { }

  public addSubLine(line: CanvasLine): void {
    this._lines.push(line);
  }
}
