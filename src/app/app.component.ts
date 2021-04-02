import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Paint JS';

  constructor(private _appService: AppService) { }

  get sidenavExpanded(): boolean {
    return this._appService.sidenavExpanded$.value;
  }
}
