import type { p5InstanceExtensions } from 'p5';
import { centerX, centerY, lines, gray } from '../variables';
import { generateColorWOpacity } from '../utils';
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
export class Note2 extends Note {
    draw(){
        const that = this.hasLine
        if(that) {
            const lineColor = `rgba(0,0,0,${ that.isFuture ? opacity(that.x) : 0 })`;
            this.c.stroke(lineColor)
            this.c.strokeWeight(1)
            let start= {
                x: centerX,
                y: centerY
            };
            let cp1 = { x: that.x,   y: centerY + 20  };
            let cp2 = { x: that.x,   y: centerY + 90  };
            let end = { x: that.x,   y: centerY + 10};

            // down older
            this.c.noFill();
            this.c.bezier(start.x, start.y, cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
            this.c.fill(`rgba(0,0,0,${ that.isFuture ? opacity(that.x) : 0 })`);
            this.c.line(end.x + 6, end.y + 6, end.x, end.y);
            this.c.line(end.x - 6, end.y + 6, end.x, end.y);
            // up older

            this.c.textFont('Arial', 14)
            this.c.strokeWeight(0)
            this.c.fill(`rgba(0,0,0,${ opacity(that.x) })`)
            let str = 'Вот эта секунда больше никогда не повторится \n' +
                ' Она уникальная раз в жизни \n Её координаты ' + format(that.date, 'y.MM.dd..HH.mm.ss');

            if(that.isPast) {
                str = 'Всё, она прошла'
            }
            // text(str, centerX, centerY + 70);
            printAtCenter(str, centerY + 70, 20);

        }
    }
}
export class Note1 extends Note {
    draw(){
        const that = this.hasLine
        if(that) {
            const offsetTitle = 70
            const offsetSubTitle = 96
            if(that.isPast) {
                const pastTextTitle = 'Тут уже прошлое';
                const pastTextSubTitle = 'Его не изменить, время прошло\nОстались только память, опыт и история';

                this.c.fill(generateColorWOpacity(200, 200, 200, that.x));

                this.c.textFont('Arial', 26);
                this.c.strokeWeight(0)
                this.c.text(pastTextTitle, that.x, centerY + offsetTitle);

                this.c.textFont('Arial', 18);
                this.c.strokeWeight(0)
                this.c.text(pastTextSubTitle, that.x, centerY + offsetSubTitle);
            }

            const futureTextTitle = 'Здесь ещё будущее';
            const futureTextSubTitle = 'Если делать дела, то на него можно повлиять';

            // FutureLineColor
            const red = generateColorWOpacity(222, 69, 84, that.x);
            this.c.fill(red);
            this.c.textFont('Arial', 26)
            this.c.strokeWeight(0)

            // Подстилка под будущее цвета фона
            const shadowBox = () => {
                this.c.fill(gray)
                this.c.stroke(0)
                this.c.strokeWeight(1)
                this.c.rect(centerX, centerY + offsetTitle, this.c.textWidth(futureTextTitle), 54)
            }
            if(that.isPast) {
                // Подстилка под будущее цвета фона
                shadowBox()

                // Текст Будущего
                this.c.fill(red);
                // fill(redAlpha);
                this.c.text(futureTextTitle, centerX, centerY + offsetTitle);

                // Подтекст Будущего
                this.c.textFont('Arial', 18);
                shadowBox()
                this.c.fill(red);
                // fill(redAlpha);
                this.c.text(futureTextSubTitle, centerX, centerY + offsetSubTitle);
            }
            if(that.isFuture) {
                // Заголовок Будущего
                this.c.text(futureTextTitle, that.x, centerY + offsetTitle);

                // Подзаголовок Будущего
                this.c.textFont('Arial', 18);
                this.c.text(futureTextSubTitle, that.x, centerY + offsetSubTitle);
            }

        }
    }
}