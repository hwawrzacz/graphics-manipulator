import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { CommonModule } from '@angular/common';
import { CanvasToolbarComponent } from './components/canvas-toolbar/canvas-toolbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasSettingsMenuComponent } from './components/canvas-settings-menu/canvas-settings-menu.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HelpComponent } from './components/help/help.component';
import { AppRoutingModule } from './routing/app-routing/app-routing.module';
import { CommonMaterialModule } from './modules/common-material/common-material.module';

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
    CommonMaterialModule,

    ColorPickerModule,
    AppRoutingModule,
  ],
  entryComponents: [
    HelpComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
