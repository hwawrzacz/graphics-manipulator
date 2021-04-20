import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';

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
  private readonly HSV_DEG_MIN = 0;
  private readonly HSV_DEG_MAX = 360;
  private readonly HSV_PERC_MIN = 0;
  private readonly HSV_PERC_MAX = 100;

  private _rgbForm: FormGroup = {} as FormGroup;
  private _hsvForm: FormGroup = {} as FormGroup;

  get colorPreview(): string {
    return this._rgbForm
      ? `rgb(${this.rgbForm.get('r')?.value},${this.rgbForm.get('g')?.value},${this.rgbForm.get('b')?.value})`
      : 'black'
  }

  get rgbForm(): FormGroup {
    return this._rgbForm;
  }

  get hsvForm(): FormGroup {
    return this._hsvForm;
  }

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForms();
    this.watchFormControlChanges();
  }

  //#region Initialization
  private buildForms(): void {
    this._rgbForm = this._formBuilder.group({
      r: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      g: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      b: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]]
    });

    this._hsvForm = this._formBuilder.group({
      h: [0, [Validators.min(this.HSV_DEG_MIN), Validators.max(this.HSV_DEG_MAX)]],
      s: [0, [Validators.min(this.HSV_PERC_MIN), Validators.max(this.HSV_PERC_MAX)]],
      v: [0, [Validators.min(this.HSV_PERC_MIN), Validators.max(this.HSV_PERC_MAX)]]
    })
  }

  private watchFormControlChanges(): void {
    // Watch RGB form changes
    Object.keys(this._rgbForm.controls).forEach(name => {
      const control = this._rgbForm.get(name);
      control?.valueChanges.pipe(
        filter(() => control.valid),
        tap(() => this.onConvertRgbToHsv())
      ).subscribe();
    });

    // Watch HSV form changes
    // console.log(Object.keys(this._hsvForm.controls));
    // Object.keys(this._hsvForm.controls).forEach(name => {
    //   const control = this._hsvForm.get(name);
    //   control?.valueChanges.pipe(
    //     filter(() => control.valid),
    //     tap(() => this.onConvertHsvToRgb())
    //   ).subscribe();
    // });
  }
  //#endregion

  //#region RGB to HSV conversion
  private onConvertRgbToHsv(): void {
    // Get color from form
    const rgbColor: RgbModel = {
      r: this._rgbForm.get('r')!.value,
      g: this._rgbForm.get('g')!.value,
      b: this._rgbForm.get('b')!.value,
    };

    // Convert color
    const hsvColor = this.convertRgbToHsv(rgbColor);

    // Put converted color to form
    this._hsvForm.patchValue({
      h: hsvColor.h,
      s: hsvColor.s,
      v: hsvColor.v,
    });
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
    const v = this.roundTo2Decimal(cMax * 100); // Multiply by 100 to get percent

    return { h: h, s: s, v: v };
  }

  /** Returns hue value in degrees */
  private calculateHue(delta: number, cMax: number, parsedColor: RgbModel): number {
    const { r, g, b } = parsedColor;
    let result;

    if (delta === 0)
      result = 0;
    else if (cMax === r)
      result = (((g - b) / delta) % 6) * 60;
    else if (cMax === g)
      result = (((b - r) / delta) + 2) * 60;
    else
      result = (((r - g) / delta) + 4) * 60;

    return this.roundTo2Decimal(result);
  }

  /** Returns saturation value in percents */
  private calculateSaturation(delta: number, cMax: number): number {
    return cMax === 0 ? 0 : this.roundTo2Decimal((delta / cMax) * 100); // Multiply by 100 to get percent
  }
  //#endregion

  //#region HSV to RGB conversion
  private onConvertHsvToRgb(): void {
    // Get color from form
    const hsvColor: HsvModel = {
      h: this._hsvForm.get('h')!.value,
      s: this._hsvForm.get('s')!.value,
      v: this._hsvForm.get('v')!.value
    };

    // Convert color
    const rgbColor = this.convertHsvToRgb(hsvColor);

    // Put converted color to form
    this._rgbForm.patchValue({
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b
    });
  }

  private convertHsvToRgb(color: HsvModel): RgbModel {
    const { h, s, v } = color;

    if (0 <= h && h <= 360
      && 0 <= s && s <= 100
      && 0 <= v && v <= 100
    ) {
      const c = (v / 100) * (s / 100);
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const color = this.getTmpRgbColor(h, c, x);
      const m = (v / 100) - c;
      const r = (color.r + m) * 255;
      const g = (color.g + m) * 255;
      const b = (color.b + m) * 255;

      return { r: r, g: g, b: b };
    }
    else
      return { r: 0, g: 0, b: 0 };
  }

  private getTmpRgbColor(h: number, c: number, x: number): RgbModel {
    let result: RgbModel = { r: 0, g: 0, b: 0 };

    if (h < 60 || h === 360)
      result = { r: c, g: x, b: 0 };
    else if (h < 120)
      result = { r: x, g: c, b: 0 };
    else if (h < 180)
      result = { r: 0, g: c, b: x };
    else if (h < 240)
      result = { r: 0, g: x, b: c };
    else if (h < 300)
      result = { r: x, g: 0, b: c };
    else if (h < 360)
      result = { r: c, g: 0, b: x };

    return result;
  }
  //#endregion

  //#region Helpers
  private roundTo2Decimal(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
  //#endregion
}
