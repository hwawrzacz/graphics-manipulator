import { Point } from './point';

/** Line which contains color and width */
export interface CanvasLine {
  p1: Point;
  p2: Point;
  width: number;
  color: string;
}