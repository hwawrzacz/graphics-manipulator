import { Component, OnInit } from '@angular/core';
import { CanvasStateService } from 'src/app/services/canvas-state.service';

@Component({
  selector: 'app-canvas-settings-menu',
  templateUrl: './canvas-settings-menu.component.html',
  styleUrls: ['./canvas-settings-menu.component.scss']
})
export class CanvasSettingsMenuComponent implements OnInit {
  get strokeColor(): string {
    return this._canvasStateService.strokeColor$.value;
  }

  get strokeWidth(): number {
    return this._canvasStateService.strokeWidth$.value;
  }

  constructor(private _canvasStateService: CanvasStateService) { }

  ngOnInit(): void {
  }

  public changeStrokeColor(event: Event): void {
    console.log(event);
  }

  public changeStrokeWidth(event: Event): void {
    console.log(event);
  }

}
