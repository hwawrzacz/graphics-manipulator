import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { CommonModule } from '@angular/common';
import { CanvasToolbarComponent } from './components/canvas-toolbar/canvas-toolbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasSettingsMenuComponent } from './components/canvas-settings-menu/canvas-settings-menu.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HelpComponent } from './components/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    CanvasToolbarComponent,
    ToolbarComponent,
    CanvasSettingsMenuComponent,
    HelpComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,

    ColorPickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
