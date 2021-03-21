import { CanvasLine } from './canvas-line';
import { CanvasPoint } from './canvas-point';
import { CurvedLine } from './curved-line';

export interface CanvasStorageSnapshot {
  straightLines: CanvasLine[];
  curvedLines: CurvedLine[];
  points: CanvasPoint[];

}