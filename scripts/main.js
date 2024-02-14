import p5 from 'p5';
import { Clock } from './classes/Clock';
import { Line } from './classes/Line';
import { Note1 } from './classes/Notes';
import {
	centerX,
	centerY,
	clock, gray, lines, linesCount, unit, note1,
	setCenterX, setCenterY,
	setClock, setLines, setWidthBetweenLines, setUnit, setLinesCount, setNote1
} from './variables';
import { DAY, SEC, MIN, HOUR, upLimitLine, downLimitLine } from './constans';
import { themeToggle } from './utils';
// const messages = []
// class Message extends Note {
// 	constructor(date, msg) {
// 		super(date);
// 		this.msg = msg;
// 	}
// 	super;
// 	draw() {
// 		const that = this.hasLine
// 		if(that) {
// 			window.p5.textFont('Arial', 16);
// 			window.p5.strokeWeight(1)
// 			window.p5.fill('black')
// 			window.p5.text(this.msg, that.x, centerY + 70);
// 		}
//
// 	}
// }
let lastMouseY = 0
const s = ( sketch ) => {
	sketch.setup = () => {
		const c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
		c.mouseClicked(mousePress);
		setCenterX(sketch.width / 2);
		setCenterY(sketch.height / 2);
		setClock(new Clock(sketch));
		init()

		const note1 = new Note1(Math.floor(Date.now() / unit) * unit + 10000, sketch)
		setNote1(note1);
		// note2 = new Note2(Math.floor(Date.now() / unit) * unit + 10000)
	};
	sketch.draw = () => {
		sketch.background(gray);
		clock.update();

		lines.forEach(line => {
			line.update()
		})
		note1.update()
		// note2.update()
		// sketch.strokeWeight(1)
		// sketch.stroke('black')
		// sketch.line(0, centerY, sketch.width, centerY)
		// sketch.line(centerX, 0, centerX, sketch.height)
		// fpsMeterLoop();
	};
	sketch.windowResized = () => {
		sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
		sketch.setup();
	};
	sketch.mouseWheel = () => {
		let delta = Math.round(event.delta);

		if(delta > 0) {
			if(linesCount > upLimitLine) {
				if(unit === SEC) {
					setUnit(MIN)
					setLinesCount(Math.round(upLimitLine / (MIN / 1000)))
				}
				else if(unit === MIN) {
					setUnit(HOUR)
					setLinesCount(Math.round(upLimitLine / (HOUR / 1000)))
				}
				else if(unit === HOUR) {
					setUnit(DAY)
					setLinesCount(Math.round(upLimitLine / (DAY / 1000)))
				}
			}
			else {
				// all_lines = all_lines + Math.ceil(all_lines / 10);
				setLinesCount(linesCount + 1)
			}
		}
		if(delta < 0) {
			if(linesCount <= downLimitLine) {
				if(unit === DAY) {
					setUnit(HOUR)
					setLinesCount(upLimitLine)
				}
				else if(unit === HOUR) {
					setUnit(MIN)
					setLinesCount(upLimitLine)
				}
				else if(unit === MIN) {
					setUnit(SEC)
					setLinesCount(upLimitLine)
				}
			}
			else {
				// all_lines = all_lines - Math.ceil(all_lines / 10);
				setLinesCount(linesCount - 1)
			}
		}
		init()
	};
	sketch.touchMoved = () => {
		if(sketch.mouseY > lastMouseY) {
			// down
			mouseWheel({ delta: -10 })
		}
		if(sketch.mouseY < lastMouseY) {
			// up
			mouseWheel({ delta: 10 })
		}
		lastMouseY = sketch.mouseY
	};
};
window.p5 = new p5(s, '#canvas');
function init() {
	setWidthBetweenLines(window.p5.width / linesCount);

	let first_sec_on_display = clock.now - (linesCount * unit) / 2;
	const lines = Array(linesCount).fill('').map((line, index) => {
		const lineDate = first_sec_on_display + index * unit
		let floor = Math.floor(lineDate / unit) * unit
		if(unit === DAY) {
			// var timestamp = date.getTime();
			floor = new Date(floor).setHours(0);
		}
		return new Line(floor, window.p5)
	});
    setLines(lines);
	window.themeToggle = themeToggle;
}
function mousePress() {
	console.log('mousePress');
}
