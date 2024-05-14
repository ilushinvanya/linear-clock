import type { p5InstanceExtensions } from 'p5';
import { centerX, centerY } from '../variables';
import { SEC, ClockColor } from '../constans';
import { format, normalizeTime } from '../utils';

export class Clock {
    c;
    now = normalizeTime(Date.now(), SEC);
    constructor(sketch: p5InstanceExtensions) {
        this.c = sketch;
    }
    update() {
        this.now = normalizeTime(Date.now(), SEC);
        this.draw();
    }
    draw() {
        this.c.textFont('Arial', 144)
        const textString = format(this.now);
        const tWidth = this.c.textWidth(textString);
        const textCenter = tWidth / 2;

        this.c.noStroke();
        this.c.fill(ClockColor);
        this.c.text(textString, centerX - textCenter, centerY + 40);
    }
}
