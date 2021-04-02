import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public sidenavExpanded$ = new BehaviorSubject(false);
  public toolbarExpanded$ = new BehaviorSubject(false);

  constructor() { }
}
