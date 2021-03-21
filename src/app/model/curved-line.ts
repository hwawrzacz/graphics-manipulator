import { Line } from './line';

/** Curved line, which contains a set of sublines */
export class CurvedLine {
  //#region Getters and setters
  get lines(): Line[] {
    return this._lines;
  }
  set lines(value: Line[]) {
    this._lines = value;
  }
  //#endregion

  constructor(private _lines: Line[] = []) { }

  public addSubLine(line: Line): void {
    this._lines.push(line);
  }
}
