import { Point } from './point';

export interface CanvasRectangle {
  p1: Point;
  p2: Point;
  width: number;
  color: string;
  path?: Path2D;
}