import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  private _title = '';
  private _expanded = true;

  //#region Getters and setters
  @Input('title')
  set title(value: string) {
    this._title = value;
  }
  get title(): string {
    return this._title;
  }

  get expanded(): boolean {
    return this._expanded;
  }
  //#endregion

  constructor() { }

  ngOnInit(): void {
  }

  public toggleToolbar(): void {
    this._expanded = !this._expanded;
  }
}
