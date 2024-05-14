import p5 from 'p5';
import { Clock } from './classes/Clock';
import { Line } from './classes/Line';
import { Note1, Note2 } from './classes/Notes';
import {
	centerX,
	centerY,
	textLineCenterY,
	clock,
	gray,
	lines,
	linesCount,
	unit,
	note1,
	note2,
	setCenterX,
	setCenterY,
	setClock,
	setLines,
	setWidthBetweenLines,
	setUnit,
	setLinesCount,
	setNote1,
	setNote2,
	setTextLineCenterY,
} from './variables';
import { DAY, SEC, MIN, HOUR, upLimitLine, downLimitLine } from './constans';
import { themeToggle, htmlFullScreen, normalizeTime, languageToggle, toggleActiveVibrate } from './utils';


let lastMouseX = 0
let lastMouseY = 0
const s = ( sketch ) => {
	sketch.setup = () => {
		const c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
		c.mouseClicked(mousePress);
		setCenterX(sketch.width / 2);
		setCenterY(sketch.height / 2);

		const diff =  sketch.height - (centerY + 60);
		const heightOfBottom = centerY + 60 + (diff / 2);
		setTextLineCenterY(heightOfBottom);

		setClock(new Clock(sketch));
		init(sketch)

		const offsetTimeSec = 20000
		const note1 = new Note1(normalizeTime() + offsetTimeSec, sketch)
		setNote1(note1);

		const offset2TimeSec = 140000
		const note2 = new Note2(normalizeTime() + offset2TimeSec, sketch)
		setNote2(note2);
	};
	sketch.draw = () => {
		sketch.background(gray);
		clock.update();

		lines.forEach(line => {
			line.update()
		})
		if(note1?.update) note1.update()
		if(note2?.update && !note1) note2.update()

		// sketch.strokeWeight(1)
		// sketch.stroke('black')
		// sketch.line(0, centerY, sketch.width, centerY)
		// sketch.line(centerX, 0, centerX, sketch.height)
		// sketch.line(0, centerY + 60, sketch.width, centerY + 60)
		// sketch.line(0, textLineCenterY, sketch.width, textLineCenterY)
		// fpsMeterLoop();
	};
	sketch.windowResized = () => {
		sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
		sketch.setup();
	};
	sketch.mouseWheel = (event) => {
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
				setLinesCount(linesCount + delta)
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
				else if(unit === SEC) {
					setUnit(SEC)
					setLinesCount(downLimitLine)
				}
			}
			else {
				// all_lines = all_lines - Math.ceil(all_lines / 10);
				setLinesCount(linesCount + delta)
			}
		}
		init(sketch)
	};
	sketch.touchMoved = () => {
		if(sketch.mouseY > lastMouseY) {
			// down
			sketch.mouseWheel({ delta: -4 })
		}
		if(sketch.mouseY < lastMouseY) {
			// up
			sketch.mouseWheel({ delta: 4 })
		}
		lastMouseY = sketch.mouseY
		lastMouseX = sketch.mouseX
	};
};
new p5(s);
function init(p5) {
	setWidthBetweenLines(p5.width / linesCount);

	let first_sec_on_display = clock.now - (linesCount * unit) / 2;
	const lines = Array(linesCount).fill('').map((line, index) => {
		const lineDate = first_sec_on_display + index * unit
		let floor = normalizeTime(lineDate, unit);
		if(unit === DAY) {
			floor = new Date(floor).setHours(0);
		}
		return new Line(floor, p5)
	});
    setLines(lines);
	window.themeToggle = themeToggle;
	window.htmlFullScreen = htmlFullScreen;
	window.languageToggle = languageToggle;
	window.toggleActiveVibrate = toggleActiveVibrate;
}
function mousePress() {
	console.log('mousePress');
}
