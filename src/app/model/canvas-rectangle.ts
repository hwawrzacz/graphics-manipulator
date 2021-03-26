import { Point } from './point';

export interface CanvasRectangle {
  p1: Point;
  p2: Point;
  color: string;
  strokeWidth: number;
  isDrawnFromCenter?: boolean;
  path?: Path2D;
}