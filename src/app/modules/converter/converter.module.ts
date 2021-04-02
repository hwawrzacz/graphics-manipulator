import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterComponent } from '../../components/converter/converter.component';
import { ConverterRoutingModule } from '../../routing/converter-routing/converter-routing.module';

@NgModule({
  declarations: [ConverterComponent],
  imports: [
    CommonModule,
    ConverterRoutingModule
  ],
  bootstrap: [ConverterComponent]
})
export class ConverterModule { }
