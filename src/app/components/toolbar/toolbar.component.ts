import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  private _title = '';

  //#region Getters and setters
  @Input('title')
  set title(value: string) {
    this._title = value;
  }
  get title(): string {
    return this._title;
  }

  get toolbarExpanded(): boolean {
    return this._appService.toolbarExpanded$.value;
  }
  //#endregion

  constructor(private _appService: AppService) { }

  ngOnInit(): void {
  }

  public onToggleToolbar(): void {
    this.collapseSidenav();
    const newValue = !this._appService.toolbarExpanded$.value
    this._appService.toolbarExpanded$.next(newValue);
  }

  public onToggleSidenav(): void {
    this.collapseToolbar();
    const newValue = !this._appService.sidenavExpanded$.value
    this._appService.sidenavExpanded$.next(newValue);
  }

  private collapseToolbar(): void {
    this._appService.toolbarExpanded$.next(false);
  }

  private collapseSidenav(): void {
    this._appService.sidenavExpanded$.next(false);
  }
}
