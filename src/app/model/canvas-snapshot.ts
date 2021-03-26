import { CanvasLine } from './canvas-line';
import { CanvasPoint } from './canvas-point';
import { CanvasRectangle } from './canvas-rectangle';
import { CanvasEllipse } from './ellipse';

export interface CanvasSnapshot {
  points: CanvasPoint[];
  curvedLines: CanvasLine[];
  straightLines: CanvasLine[];
  rectangles: CanvasRectangle[];
  ellipses: CanvasEllipse[];

}