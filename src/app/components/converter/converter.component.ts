import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorMode } from 'ngx-color-picker/lib/helpers';
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

  private _rgbForm: FormGroup = {} as FormGroup;
  private _hsvForm: FormGroup = {} as FormGroup;

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
      h: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      s: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]],
      v: [0, [Validators.min(this.RGB_MIN), Validators.max(this.RGB_MAX)]]
    })
  }

  private watchFormControlChanges(): void {
    Object.keys(this._rgbForm.controls).forEach(name => {
      const control = this._rgbForm.get(name);
      console.log(control ? control.value : 'No control');
      control?.valueChanges.pipe(
        filter(() => control.valid),
        tap(() => this.onRgbFormControlChange())
      ).subscribe()
    });
  }
  //#endregion

  private onRgbFormControlChange(): void {
    const color: RgbModel = {
      r: this._rgbForm.get('r')!.value,
      g: this._rgbForm.get('g')!.value,
      b: this._rgbForm.get('b')!.value,
    };

    const hsv = this.convertRgbToHsv(color);
    this._hsvForm.patchValue({
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
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

  private roundTo2Decimal(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
