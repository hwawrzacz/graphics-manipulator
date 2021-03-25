import { CanvasLine } from './canvas-line';
import { CanvasPoint } from './canvas-point';

export interface CanvasSnapshot {
  straightLines: CanvasLine[];
  curvedLines: CanvasLine[];
  points: CanvasPoint[];

}