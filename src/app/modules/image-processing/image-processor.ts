import { Filter, FilterCategory } from 'src/app/model/filter';
import * as cv from '@techstark/opencv-js'
import { CV_8U } from '@techstark/opencv-js';

export class ImageProcessor {
  constructor(private _canvasInpuutId: string, private _canvasOutputId: string) {

  }

  public transformImage(filter: Filter): void {
    const source = cv.imread(this._canvasInpuutId);
    const destination = new cv.Mat();
    this.handleFilterDependingOnCategory(filter, source, destination);
    source.delete();
    destination.delete();
  }

  private handleFilterDependingOnCategory(filter: Filter, source: cv.Mat, destination: cv.Mat): void {
    const filterCategory = this.getFilterCategory(filter);
    switch (filterCategory) {
      case FilterCategory.BLUR:
        this.applyBlurFilter(filter, source, destination)
        break;
      case FilterCategory.COLOR:
        this.applyColorFilter(filter, source, destination);
        break;
      default:
      // Handle filter error 
    }
  }

  private getFilterCategory(filter: Filter): FilterCategory {
    switch (filter) {
      case Filter.BLUR_3X3:
      case Filter.BLUR_7X7:
      case Filter.BLUR_14x14: return FilterCategory.BLUR;

      case Filter.NONE:
      case Filter.LUV:
      case Filter.GRAYSCALE: return FilterCategory.COLOR;

      default: return FilterCategory.UNKNOWN;
    }
  }

  private applyBlurFilter(filter: Filter, src: cv.Mat, dst: cv.Mat): void {
    const kernelSize = this.getBlurSize(filter);
    const anchor = new cv.Point(-1, -1);
    const border = cv.BORDER_DEFAULT;
    cv.blur(src, dst, kernelSize, anchor, border);
    cv.imshow('canvasOutput', dst);
  }

  /** Returns size depending on given blur filter 
   * @param filter - blur filter
   * 
   * @returns cv.Size. If given filter is not blur filter it will return Size(1, 1)
  */
  private getBlurSize(filter: Filter): cv.Size {
    switch (filter) {
      case Filter.BLUR_3X3: return new cv.Size(3, 3);
      case Filter.BLUR_7X7: return new cv.Size(7, 7);
      case Filter.BLUR_14x14: return new cv.Size(14, 14);
      default: return new cv.Size(1, 1);
    }
  }

  private applyColorFilter(filter: Filter, src: cv.Mat, dst: cv.Mat): void {
    const filterCode = this.getFilterCode(filter);
    cv.cvtColor(src, dst, filterCode, 0);
    cv.imshow('canvasOutput', dst);
  }

  private applyCustomFilter(filter: Filter, src: cv.Mat, dst: cv.Mat): void {
    const kernelSize = 3;
    const kernel = this.createCustomKernel(kernelSize);
    const anchor = new cv.Point(-1, -1);
    const border = cv.BORDER_DEFAULT;
    const ddepth = -1;
    cv.filter2D(src, dst, ddepth, kernel, anchor, border);
    cv.imshow('canvasOutput', dst);
  }

  private createCustomKernel(size = 2): cv.Mat {
    const kernel = cv.Mat.eye(size, size, CV_8U)
    return kernel;
  }

  private getFilterCode(filter: Filter): cv.ColorConversionCodes {
    switch (filter) {
      case Filter.GRAYSCALE: return cv.COLOR_RGB2GRAY;
      case Filter.LUV: return cv.COLOR_RGB2Luv;
      case Filter.NONE: return cv.COLOR_RGB2RGBA;
      default: return cv.COLOR_RGB2RGBA;
    }
  }
}