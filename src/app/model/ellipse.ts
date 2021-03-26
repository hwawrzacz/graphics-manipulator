import { Point } from './point';

export interface CanvasEllipse {
  p1: Point;
  p2: Point;
  strokeWidth: number;
  color: string;
  isDrawnFromCenter?: boolean;
  path?: Path2D;
}