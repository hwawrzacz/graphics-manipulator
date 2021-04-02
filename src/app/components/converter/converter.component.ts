import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorMode } from 'ngx-color-picker/lib/helpers';

interface RgbModel {
  r: number;
  g: number;
  b: number;
}

interface HsvModel {
  h: number;
  s: number;
  v: number;
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  private readonly RGB_MIN = 0;
  private readonly RGB_MAX = 255;

  private _rgbForm?: FormGroup;
  private _hsvForm?: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForms();
    const hsv = this.convertRgbToHsv({ r: 100, g: 150, b: 200 });
    console.log(hsv);
  }

  private buildForms(): void {
    this._rgbForm = this._formBuilder.group({
      r: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      g: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      b: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]]
    });

    this._hsvForm = this._formBuilder.group({
      h: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      s: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      v: [null, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]]
    })
  }

  private convertRgbToHsv(color: RgbModel): HsvModel {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const cMax = Math.max(r, g, b);
    const cMin = Math.min(r, g, b);
    const delta = cMax - cMin;
    const parsedColor: RgbModel = { r: r, g: g, b: b };

    const h = this.calculateHue(delta, cMax, parsedColor)
    const s = this.calculateSaturation(delta, cMax);
    const v = this.roundToDecimal(cMax * 100); // Multiply by 100 to get percent

    return { h: h, s: s, v: v };
  }

  /** Returns hue value in degrees */
  private calculateHue(delta: number, cMax: number, parsedColor: RgbModel): number {
    const { r, g, b } = parsedColor;

    if (delta === 0)
      return 0;

    if (cMax === r)
      return (((g - b) / delta) % 6) * 60;
    if (cMax === g)
      return (((b - r) / delta) + 2) * 60;

    return (((r - g) / delta) + 4) * 60;
  }

  /** Returns saturation value in percents */
  private calculateSaturation(delta: number, cMax: number): number {
    return cMax === 0 ? 0 : delta / cMax * 100; // Multiply by 100 to get percent
  }

  private roundToDecimal(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
