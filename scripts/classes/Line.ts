import type { p5InstanceExtensions } from 'p5';
import {
    unit,
    lines,
    centerX,
    centerY,
    linesCount,
    isActiveVibrate,
    widthBetweenLines,
    setLines,
} from '../variables';
import { SEC, MIN, HOUR, DAY, FutureLineColor, PastLineColor, downLimitLine, upLimitLine } from '../constans';
export class Line {
    private readonly date: number;
    private readonly seconds: number;
    private readonly minutes: number;
    private readonly hours: number;
    private readonly days: number;
    private readonly month: number;
    private readonly year: number;
    private isPast: boolean;
    private isFuture: boolean;
    private readonly isSecond: boolean;
    private readonly isMinute: boolean;
    private readonly isHour: boolean;
    private readonly isDay: boolean;
    private readonly isMonth: boolean;
    private readonly isYear: boolean;
    private x: number;
    private yStart: number;
    private yEnd: any;
    private pxDiff: number;
    private isHover: boolean;
    private message: string;
    private readonly c:p5InstanceExtensions;
    constructor(date: number, sketch: p5InstanceExtensions) {
        this.c = sketch;
        this.date = date
        this.seconds = new Date(this.date).getSeconds();
        this.minutes = new Date(this.date).getMinutes();
        this.hours = new Date(this.date).getHours();
        this.days = new Date(this.date).getDate();
        this.month = new Date(this.date).getMonth();
        this.year = new Date(this.date).getFullYear();
        this.isPast = false;
        this.isFuture = false;
        this.isSecond = this.seconds !== 0;
        this.isMinute = this.seconds === 0 && this.minutes !== 0;
        this.isHour =   this.seconds === 0 && this.minutes === 0 && this.hours !== 0;
        this.isDay =    this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days !== 1;
        this.isMonth =  this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 1 && this.month !== 0;
        this.isYear =   this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 1 && this.month === 0;

        this.x = 0;

        this.yStart = centerY - 62;
        this.yEnd = centerY + 40;

        this.pxDiff = widthBetweenLines / unit; // сколько пикселей в 1000 - одной милисекунде, 60 000  - одной секунде

        if(this.isMinute) {
            this.yStart = this.yStart - 6;
            // this.yEnd = this.yEnd + 6;
        }

        if(this.isHour) {
            this.yStart = this.yStart - 12;
            // this.yEnd = this.yEnd + 12;
        }

        if(this.isDay) {
            this.yStart = this.yStart - 18;
            // this.yEnd = this.yEnd + 18;
        }

        if(this.isMonth) {
            this.yStart = this.yStart - 24;
            // this.yEnd = this.yEnd + 24;
        }

        if(this.isYear) {
            this.yStart = this.yStart - 30;
            // this.yEnd = this.yEnd + 30;
        }
        this.isHover = false
        this.message = ''
    }
    update() {
        this.pxDiff = widthBetweenLines / unit; // сколько пикселей в одной милисекунде
        const timeDiff = Date.now() - this.date;
        this.x = centerX - timeDiff * this.pxDiff;
        this.isPast = timeDiff >= 0;
        if(this.isFuture && this.isPast && isActiveVibrate) {
            navigator.vibrate(10)
        }
        this.isFuture = timeDiff < 0;

        if(this.x < -1) {
            const sticks = lines.filter((line, index) => {
                return index;
            })
            const last_elem = sticks[sticks.length - 1];
            if(!last_elem) return;
            sticks.push(new Line(last_elem.date + unit, this.c));
            setLines(sticks)
        }
        // const halfLine = widthBetweenLines / 2;
        // this.isHover = this.x + halfLine > this.c.mouseX && this.c.mouseX > this.x - halfLine;
        // if(this.c.mouseIsPressed && this.isHover) {
        //     console.log('mouseIsPressed && isHover');
        //     this.message = '111';
            // const selectedLine = lines.find(line => line.isHover);
            // 	const selectedDate = selectedLine?.date;
            // 	const selectedMsg = messages.find(msg => msg.date === selectedDate);
            // 	if(selectedMsg) {
            // 		const msgText = prompt('Напишите что-нибудь', selectedMsg.msg);
            // 		selectedMsg.msg = msgText;
            // 	}
            // 	else {
            // 		const msgText = prompt('Напишите что-нибудь');
            // 		messages.push(new Message(selectedDate, msgText))
            // 	}
        // }
        this.draw()
    }
    draw() {
        if(this.isPast) {
            this.c.stroke(PastLineColor)
            this.c.strokeWeight(1)
            this.c.fill(PastLineColor)
        }
        else if(this.isFuture) {
            this.c.stroke(FutureLineColor);
            // stroke('black');
            this.c.strokeWeight(2);
            this.c.fill(FutureLineColor)
        }

        if(this.isHover) {
            this.c.strokeWeight(5);
        }

        // fill('rgba(0,0,0,0)')
        // if(centerX - widthBetweenLines / 2 < this.x && this.x < centerX) {
        // 	bezier(this.x, this.yStart, centerX, centerY, centerX, centerY, this.x, this.yEnd);
        // }
        // else {
        this.c.line(this.x, this.yStart, this.x, this.yEnd)
        // }


        this.c.noStroke()
        const number =
            this.isSecond ? this.seconds :
                this.isMinute ? this.minutes :
                    this.isHour ? this.hours :
                        this.isDay ? this.days :
                            this.isMonth ? this.month + 1 :
                                this.isYear ? this.year : 0;

        const topText = (unit === SEC && !this.isSecond) ||
        (unit === MIN && !this.isMinute) ||
        (unit === HOUR && !this.isHour) ||
        (unit === DAY && !this.isDay) ? `${number}` : '';

        let bottomText = `${number}`
        if(topText) {
            bottomText = this.isMonth ? '1' : '0'
        }

        this.c.textFont('Arial', 15)
        const topWidth = this.c.textWidth(topText);
        this.c.text(topText, this.x - topWidth / 2, this.yStart - 6);


        const step = linesCount - downLimitLine
        const maxFS = 20
        const minFS = 4
        const k = (maxFS - minFS) / (upLimitLine - downLimitLine) // 0.056140350877193
        const calcFS = 15 - step * k;
        const fs = calcFS > 0 ? calcFS : 1
        this.c.textFont('Arial', fs)
        const bottomWidth = this.c.textWidth(bottomText);
        this.c.text(bottomText, this.x - bottomWidth / 2, this.yEnd + 18);

        this.c.textFont('Arial', 26)
        this.c.text(this.message, this.x, this.yStart - 6);
    }
}