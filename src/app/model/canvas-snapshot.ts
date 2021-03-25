import { CanvasLine } from './canvas-line';
import { CanvasPoint } from './canvas-point';
import { CanvasEllipse } from './ellipse';

export interface CanvasSnapshot {
  points: CanvasPoint[];
  curvedLines: CanvasLine[];
  straightLines: CanvasLine[];
  rectangles: CanvasLine[];
  ellipses: CanvasEllipse[];

}