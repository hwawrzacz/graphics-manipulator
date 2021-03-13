import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DrawingMode } from '../model/canvas-mode';

export const STROKE_SIZES = [1, 2, 4, 6, 8, 10];

@Injectable({
  providedIn: 'root'
})
export class CanvasStateService {
  // Properties
  public drawingMode$ = new BehaviorSubject<DrawingMode>(DrawingMode.DRAWING);
  public strokeColor$ = new BehaviorSubject('#373737');
  public strokeWidth$ = new BehaviorSubject(2);

  // Actions
  public clear$ = new Subject();

  constructor() { }
}
