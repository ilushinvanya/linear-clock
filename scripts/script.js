function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setup();
}
const ClockColor = '#d6dae0'
const PastLineColor = '#d6dae0';
const FutureLineColor = '#de4554';
let lines = []
let clock;
let note1;
let note2;
let widthBetweenLines;
let all_lines = 16; // 1 minute = 60 sec
let centerX = 0;
let centerY = 0;
let fontSizeLine = 15;
let unit = 1000 // 1 sec difference between lines
const SEC = 1000
const MIN = 60 * 1000
const HOUR = 60 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000
const upLimitLine = 300;
const downLimitLine = 15;
class Clock {
	now = new Date(Math.floor(new Date / 1000) * 1000)
	update() {
		this.now = new Date(Math.floor(new Date / 1000) * 1000)
		this.draw();
	}
	draw() {
		noStroke()
		textFont('Arial', 124)
		const textString = format(this.now);
		const tWidth = textWidth(textString);
		const textCenter = tWidth / 2;

		fill(ClockColor);
		text(textString, centerX - textCenter, centerY + 40);
	}
}

class Line {
	constructor(date) {
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

		this.yStart = centerY - 20;
		this.yEnd = centerY + 20;

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

	}
	update() {
		this.pxDiff = widthBetweenLines / unit; // сколько пикселей в одной милисекунде
		const timeDiff = new Date - this.date;
		this.x = centerX - timeDiff * this.pxDiff;
		this.isPast = timeDiff >= 0;
		this.isFuture = timeDiff < 0;

		if(this.x < 0) {
			lines = lines.filter((line, index) => {
				return index;
			})
			const last_elem = lines[lines.length - 1];
			if(!last_elem) return;
			lines.push(new Line(last_elem.date + unit));
		}
		this.draw()
	}
	draw() {
		// let lineColor;

		if(this.isPast) {
			stroke(PastLineColor)
			strokeWeight(1)
			fill(PastLineColor)
		}
		else if(this.isFuture) {
			stroke(FutureLineColor);
			// stroke('black');
			strokeWeight(2);
			fill(FutureLineColor)
		}

		// fill('rgba(0,0,0,0)')
		// if(centerX - widthBetweenLines / 2 < this.x && this.x < centerX) {
		// 	bezier(this.x, this.yStart, centerX, centerY, centerX, centerY, this.x, this.yEnd);
		// }
		// else {
			line(this.x, this.yStart, this.x, this.yEnd)
		// }


		noStroke()
		const number =
			this.isSecond ? this.seconds :
				this.isMinute ? this.minutes :
					this.isHour ? this.hours :
						this.isDay ? this.days :
							this.isMonth ? this.month :
								this.isYear ? this.year : 0;

		const topText = (unit === SEC && !this.isSecond) ||
		(unit === MIN && !this.isMinute) ||
		(unit === HOUR && !this.isHour) ||
		(unit === DAY && !this.isDay) ? `${number}` : '';

		let bottomText = `${number}`
		if(topText) {
			bottomText = this.isMonth ? '1' : '0'
		}

		textFont('Arial', 15)
		const topWidth = textWidth(topText);
		text(topText, this.x - topWidth / 2, this.yStart - 6);


		const step = all_lines - downLimitLine
		const maxFS = 20
		const minFS = 4
		const k = (maxFS - minFS) / (upLimitLine - downLimitLine) // 0.056140350877193
		const calcFS = fontSizeLine - step * k;
		const fs = calcFS > 0 ? calcFS : 1
		textFont('Arial', fs)
		const bottomWidth = textWidth(bottomText);
		text(bottomText, this.x - bottomWidth / 2, this.yEnd + 14);
	}
}

class Note {
	constructor(date) {
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
class Note2 extends Note {
	draw(){
		const that = this.hasLine
		if(that) {
			const lineColor = `rgba(0,0,0,${ that.isFuture ? opacity(that.x) : 0 })`;
			stroke(lineColor)
			strokeWeight(1)
			let start= {
				x: centerX,
				y: centerY
			};
			let cp1 = { x: that.x,   y: centerY + 20  };
			let cp2 = { x: that.x,   y: centerY + 90  };
			let end = { x: that.x,   y: centerY + 10};

			// down older
			noFill();
			bezier(start.x, start.y, cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
			fill(`rgba(0,0,0,${ that.isFuture ? opacity(that.x) : 0 })`);
			line(end.x + 6, end.y + 6, end.x, end.y);
			line(end.x - 6, end.y + 6, end.x, end.y);
			// up older

			textFont('Arial', 14)
			strokeWeight(0)
			fill(`rgba(0,0,0,${ opacity(that.x) })`)
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
class Note1 extends Note {
	draw(){
		const that = this.hasLine
		if(that) {
			if(that.isPast) {
				const pastTextTitle = 'Тут уже прошлое';
				const pastTextSubTitle = 'Его не изменить, время прошло\nОстались только память, опыт и история';
				// lineColor = '#d6dae0';
				fill(`rgba(200,200,200,${ opacity(that.x) })`);

				textFont('Arial', 26);
				strokeWeight(0)
				text(pastTextTitle, that.x, centerY + 70);

				textFont('Arial', 18);
				strokeWeight(0)
				text(pastTextSubTitle, that.x, centerY + 96);
			}

			const futureTextTitle = 'Здесь ещё будущее';
			const futureTextSubTitle = 'Если делать дела, то на него можно повлиять';
			// lineColor = '#de4554';
			fill(`rgba(222,69,84,${ opacity(that.x) })`);
			textFont('Arial', 26)
			strokeWeight(0)

			if(that.isPast) {
				fill(245)
				rect(centerX, centerY + 50, textWidth(futureTextTitle), 40)

				fill(`rgba(222,69,84,${ opacity(that.x) })`);

				text(futureTextTitle, centerX, centerY + 70);

				textFont('Arial', 18);
				fill(245)
				rect(centerX, centerY + 80, textWidth(futureTextSubTitle), 40)

				fill(`rgba(222,69,84,${ opacity(that.x) })`);
				text(futureTextSubTitle, centerX, centerY + 96);
			}
			if(that.isFuture) {

				text(futureTextTitle, that.x, centerY + 70);

				textFont('Arial', 18);
				text(futureTextSubTitle, that.x, centerY + 96);
			}

		}
	}
}
let prevTime = Date.now(),
	frames = 0;
function fpsMeterloop() {
	const time = Date.now();
	frames++;
	if (time > prevTime + 1000) {
		let fps = Math.round((frames * 1000) / (time - prevTime));
		prevTime = time;
		frames = 0;
		PARAMS.fps = fps
	}
}
function setup() {
	const c = createCanvas(windowWidth, windowHeight);
	c.mouseClicked(mousePress);
	centerX = width / 2;
	centerY = height / 2;
	clock = new Clock();
	init()
	note1 = new Note1(Math.floor(Date.now() / unit) * unit + 30000)
	// note2 = new Note2(Math.floor(Date.now() / unit) * unit + 10000)
}


function init() {
	widthBetweenLines = width / all_lines;

	let first_sec_on_display = clock.now - (all_lines * unit) / 2;
	lines = Array(all_lines).fill('').map((line, index) => {
		const lineDate = first_sec_on_display + index * unit
		let floor = Math.floor(lineDate / unit) * unit
		if(unit === DAY) {
			floor = new Date(floor).setHours(0);
		}
		return new Line(floor)
	});
	window.PARAMS.all_lines = all_lines
}
function draw() {
	background(245);
	clock.update();

	lines.forEach(line => {
		line.update()
	})
	note1.update()
	// note2.update()
	// strokeWeight(1)
	// stroke('black')
	// line(0, centerY, width, centerY)
	// line(centerX, 0, centerX, height)
	fpsMeterloop();
}
function mousePress(event) {
}
let lastMouseY = 0
function touchMoved() {
	if(mouseY > lastMouseY) {
		// down
		mouseWheel({ delta: -10 })
	}
	if(mouseY < lastMouseY) {
		// up
		mouseWheel({ delta: 10 })
	}
	lastMouseY = mouseY
}

function mouseWheel(event) {
	let delta = Math.round(event.delta);

	if(delta > 0) {
		if(all_lines > upLimitLine) {
			if(unit === SEC) {
				unit = MIN
				all_lines = Math.round(upLimitLine / (MIN / 1000))
			}
			else if(unit === MIN) {
				unit = HOUR
				all_lines = Math.round(upLimitLine / (HOUR / 1000))
			}
			else if(unit === HOUR) {
				unit = DAY
				all_lines = Math.round(upLimitLine / (DAY / 1000))
			}
		}
		else {
			// all_lines = all_lines + Math.ceil(all_lines / 10);
			all_lines = all_lines + 1
		}
	}
	if(delta < 0) {
		if(all_lines <= downLimitLine) {
			if(unit === DAY) {
				unit = HOUR
				all_lines = upLimitLine
			}
			else if(unit === HOUR) {
				unit = MIN
				all_lines = upLimitLine
			}
			else if(unit === MIN) {
				unit = SEC
				all_lines = upLimitLine
			}
		}
		else {
			// all_lines = all_lines - Math.ceil(all_lines / 10);
			all_lines = all_lines - 1
		}
	}
	init()
}

function format(date) {
	// 'HH:mm:ss'

	const seconds = new Date(date).getSeconds();
	const minutes = new Date(date).getMinutes();
	const hours = new Date(date).getHours();
	const hourText = hours >= 10 ? hours : '0' + hours;
	const minuteText = minutes >= 10 ? minutes : '0' + minutes;
	let clockText = `${hourText}:${minuteText}`
	if(unit === SEC) {
		const secondText = seconds >= 10 ? seconds : '0' + seconds;
		return `${clockText}:${secondText}`;
	}
	return clockText;
}
const opacity = (currentX) => {
	const rightDiff = width - currentX;
	if(rightDiff < 100) {
		return rightDiff / 100;
	}

	const leftDiff = currentX;
	if(leftDiff < 100) {
		return leftDiff / 100;
	}

	return 1;
}
const printAtCenter = (str, y, lineHeight) => {
	const lines = str.split('\n');
	// const lineHeight = 15;

	for (let i = 0; i < lines.length; i++) {
		const txtWidth = textWidth(lines[i]);
		const x = centerX - (txtWidth / 2);
		text(lines[i], x, y + (i*lineHeight) );
	}
}
const printAtLeft = (str, y, offset, lineHeight) => {
	const lines = str.split('\n');
	// const lineHeight = 16;

	for (let i = 0; i < lines.length; i++) {
		// const lineHeight = c.measureText(lines[i]).actualBoundingBoxDescent;
		text(lines[i], offset, y + (i * lineHeight));
	}
}
const printAtRight = (str, y, offset, lineHeight) => {
	const lines = str.split('\n');
	// const lineHeight = 16;

	for (let i = 0; i < lines.length; i++) {
		const lineWidth = textWidth(lines[i]);
		const x = width - lineWidth - offset;
		text(lines[i], x, y + (i * lineHeight));
	}
}
