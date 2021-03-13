import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CanvasControlInfo {
  icon: string;
  /** Color of the icon. If you want to use default, just leave this field unset. 
   * 
   * Accepts: `primary`, `accent` `warn`.
  */
  iconColor?: 'primary' | 'accent' | 'warn';
  /** Label (name) of the control. */
  label: string;
  /** General description of what that controls do. 
   * You can write using HTML elements, as this property is being sanitized
   * before inserted into template. 
   */
  descriptionGeneral: string;
  /** Specific guidelines of how to use this control. 
   * You can write using HTML elements, as this property is being sanitized
   * before inserted into template. 
   */
  descriptionsUsage: string[];
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  readonly controls: CanvasControlInfo[] = [
    {
      icon: 'gesture',
      label: 'Drawing',
      descriptionGeneral: 'This mode allows you to draw line with a cursor.',
      descriptionsUsage: [
        'When cursor is over a canvas area, press and hold <strong>L</strong>eft <strong>M</strong>ouse <strong>B</strong>utton (<strong>LMB</strong>). This will start drawing shape. Moving cursor all over the canvas with <strong>LMB</strong> pressed will create shape.',

        'In this mode you can also draw a straight line by pressing <strong>Shift</strong> key and clicking around. Click anywhere on the canvas and then, with <strong>Shift</strong> key pressed, click again on the canvas. This will create a straight line between selected points.'
      ]
    },
    {
      icon: 'horizontal_rule',
      label: 'Straight line',
      descriptionGeneral: 'This mode allows you to draw a straight line.',
      descriptionsUsage: [
        'When cursor is over a canvas area, press <strong>LMB</strong> and move cursor. This will give you a preview of straight line. if you are satisfied with the line, release the <strong>LMB</strong>, and your line will be drawn.',
      ]
    },
    {
      icon: 'format_paint',
      iconColor: 'warn',
      label: 'Clear',
      descriptionGeneral: 'This option clears the canvas.',
      descriptionsUsage: ['Perfect choice if you want to clear your artwork, and never see it again.']
    },
    {
      icon: 'tune',
      label: 'Settings',
      descriptionGeneral: 'This opens settings menu.',
      descriptionsUsage: ['In settings you can change the color and the width of the stroke']
    }
  ];

  constructor(private _sanitizer: DomSanitizer) { }

  public sanitizeContent(content: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(content);
  }
}
