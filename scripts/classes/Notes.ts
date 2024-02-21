import type { p5InstanceExtensions } from 'p5';
import { centerX, centerY, lines, gray, textLineCenterY, lang } from '../variables';
import { generateColorWOpacity, printAtCenter, format } from '../utils';
import TEXTS from '../langs';

class Note {
    private readonly date: number;
    readonly c: p5InstanceExtensions;
    hasLine: any;
    constructor(date: number, sketch: p5InstanceExtensions) {
        this.c = sketch;
        this.date = date;
        this.hasLine = this.getLine();
    }
    getLine() {
        return lines.find(line => line.date === this.date)
    }
    update() {
        this.hasLine = this.getLine();
        this.draw()
    }
    draw() {}
}

export class Note1 extends Note {
    draw(){
        const that = this.hasLine
        if(that) {
            const Text = TEXTS[lang];
            const offsetTitle = textLineCenterY
            const offsetSubTitle = textLineCenterY + 26
            if(that.isPast) {
                const pastTextTitle = Text.note_1_past_title;
                const pastTextSubTitle = Text.note_1_past_sub_title;

                this.c.fill(generateColorWOpacity(200, 200, 200, that.x));

                this.c.textFont('Arial', 26);
                this.c.strokeWeight(0)
                this.c.text(pastTextTitle, that.x, offsetTitle);

                this.c.textFont('Arial', 18);
                this.c.strokeWeight(0)
                this.c.text(pastTextSubTitle, that.x, offsetSubTitle);
            }

            // console.log(TEXTS)
            const futureTextTitle = Text.note_1_future_title;
            const futureTextSubTitle = Text.note_1_future_sub_title;

            // FutureLineColor
            const red = generateColorWOpacity(222, 69, 84, that.x);
            this.c.fill(red);
            this.c.textFont('Arial', 26)
            this.c.strokeWeight(0)

            // Подстилка под будущее цвета фона
            const shadowBox = (width: number) => {
                this.c.fill(gray)
                this.c.stroke(0)
                this.c.strokeWeight(0)
                const y = offsetTitle;
                const height = 88;
                this.c.rect(centerX, y - 30, width + 100, height)
            }
            if(that.isPast) {
                // Подстилка под будущее цвета фона
                const width = this.c.textWidth(futureTextTitle);
                shadowBox(width)

                // Текст Будущего
                this.c.fill(red);
                this.c.text(futureTextTitle, centerX, offsetTitle);

                // Подтекст Будущего
                this.c.textFont('Arial', 18);
                this.c.fill(red);
                this.c.text(futureTextSubTitle, centerX, offsetSubTitle);
            }
            if(that.isFuture) {
                // Заголовок Будущего
                this.c.text(futureTextTitle, that.x, offsetTitle);

                // Подзаголовок Будущего
                this.c.textFont('Arial', 18);
                this.c.text(futureTextSubTitle, that.x, offsetSubTitle);
            }

        }
    }
}

export class Note2 extends Note {
    draw(){
        const that = this.hasLine
        if(that) {
            const Text = TEXTS[lang];
            const red = generateColorWOpacity(222, 69, 84, that.x);
            const gray = generateColorWOpacity(200, 200, 200, that.x);

            let start= {
                x: centerX,
                y: textLineCenterY - 20
            };
            let cp1 = {
                x: centerX,
                y: centerY + 80
            };
            let cp2 = {
                x: that.x,
                y: textLineCenterY
            };
            let end = {
                x: that.x,
                y: centerY + 80
            };
            this.c.stroke(that.isPast ? gray : red);
            this.c.strokeWeight(1)

            this.c.noFill();
            this.c.bezier(start.x, start.y, cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
            this.c.line(end.x + 6, end.y + 6, end.x, end.y);
            this.c.line(end.x - 6, end.y + 6, end.x, end.y);

            this.c.strokeWeight(0)
            this.c.textFont('Arial', 18)

            this.c.fill(red);
            let str = Text.note_2_future + format(that.date, true);

            if(that.isPast) {
                this.c.textFont('Arial', 26)
                this.c.fill(gray);
                str = Text.note_2_past
            }
            printAtCenter(str, textLineCenterY, 24, this.c);
        }
    }
}
