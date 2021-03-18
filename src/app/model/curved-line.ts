import { Line } from './line';

/** Curved line, which contains a set of sublines */
export class CurvedLine {
  private _lines: Line[] = [];

  //#region Getters and setters
  get lines(): Line[] {
    return this._lines;
  }
  set lines(value: Line[]) {
    this._lines = value;
  }

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value;
  }

  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }
  //#endregion

  constructor(private _width: number, private _color: string) { }

  public addSubLine(line: Line): void {
    this._lines.push(line);
  }
}
