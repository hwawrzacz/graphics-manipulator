import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  private _title = '';
  private _toolbarExpanded = true;

  //#region Getters and setters
  @Input('title')
  set title(value: string) {
    this._title = value;
  }
  get title(): string {
    return this._title;
  }

  get toolbarExpanded(): boolean {
    return this._toolbarExpanded;
  }
  //#endregion

  constructor(private _appService: AppService) { }

  ngOnInit(): void {
  }

  public toggleToolbar(): void {
    this._toolbarExpanded = !this._toolbarExpanded;
  }

  public toggleSidenav(): void {
    const newValue = !this._appService.sidenavExpanded$.value
    this._appService.sidenavExpanded$.next(newValue);
  }
}
