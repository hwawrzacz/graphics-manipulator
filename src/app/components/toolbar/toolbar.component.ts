import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { RouterControllerService } from 'src/app/services/router-controller.service';

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

  get isCanvasModuleActive(): boolean {
    return this._routerController.isCanvasModuleActive;
  }
  //#endregion

  constructor(private _appService: AppService, private _routerController: RouterControllerService) { }

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
