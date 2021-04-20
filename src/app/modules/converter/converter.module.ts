import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterComponent } from './converter/converter.component';
import { ConverterRoutingModule } from '../../routing/converter-routing/converter-routing.module';
import { CommonMaterialModule } from '../common-material/common-material.module';

@NgModule({
  declarations: [ConverterComponent],
  imports: [
    CommonModule,
    CommonMaterialModule,
    ConverterRoutingModule
  ]
})
export class ConverterModule { }
