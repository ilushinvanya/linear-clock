function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setup();
}

let lines = []
let clock;
let widthBetweenLines;
let all_lines = 100; // 1 minute = 60 sec
let centerX = 0;
let centerY = 0;
let unit = 1000 // 1 sec difference between lines
const SEC = 1000
const MIN = 60 * 1000
const HOUR = 60 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000
class Clock {
	now = new Date(Math.floor(new Date / 1000) * 1000)
	update() {
		this.now = new Date(Math.floor(new Date / 1000) * 1000)
		this.draw();
	}
	draw() {
		fill('rgba(255,255,255,0)')

		const roundedTo = unit === SEC ? 0.2 : unit === MIN ? 0.4 : unit === HOUR ? 0.7 : unit === DAY ? 0.9 : 0
		for(let i = 0.2; i <= roundedTo; i += 0.2) {
			stroke(`rgba(155,128,101,${1 - i})`)

			const lineWeight = 40;
			const arcParam = 100 + (i * lineWeight * 10)
			strokeWeight(lineWeight)
			arc(centerX, centerY, arcParam, arcParam, 0, TWO_PI)
		}


		noStroke()
		textFont('Arial', 24)
		const textString = format(this.now);
		const tWidth = textWidth(textString);
		const textCenter = tWidth / 2;

		fill('rgba(155,128,101,0.8)');

		const rectParams = {
			x: centerX - textCenter - 10,
			y: centerY - 15,
			w: tWidth + 20,
			h: 30,
		}
		rect(rectParams.x, rectParams.y, rectParams.w, rectParams.h);

		fill('#1f1f1f');
		text(textString, centerX - textCenter, centerY + 8);

		// strokeWeight(1)
		// stroke(`rgba(55,128,201,1)`)
		// line(centerX, 0, centerX, height)
		// line(0, centerY, width, centerY)

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
		let lineColor;

		if(this.isPast) {
			lineColor = '#7a795c';
			stroke(lineColor)
			strokeWeight(1)
		}
		if(this.isFuture) {
			lineColor = '#3780c9';
			stroke(lineColor);
			// stroke('black');
			strokeWeight(2);
		}

		fill('rgba(0,0,0,0)')
		// if(centerX - widthBetweenLines / 2 < this.x && this.x < centerX) {
		// 	bezier(this.x, this.yStart, centerX, centerY, centerX, centerY, this.x, this.yEnd);
		// }
		// else {
			line(this.x, this.yStart, this.x, this.yEnd)
		// }

		fill(lineColor)
		noStroke()
		textFont('Arial', 6)
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

		const topWidth = textWidth(topText);
		const bottomWidth = textWidth(bottomText);

		text(topText, this.x - topWidth / 2, this.yStart - 6);
		text(bottomText, this.x - bottomWidth / 2, this.yEnd + 14);

	}
}

class Note {
	update() {

	}
	draw() {
		// if(this.second === 2) {
		// 	c.strokeStyle = `rgba(0,0,0,${ isFuture ? opacity(this.x) : 0 })`;
		// 	c.lineWidth = 1
		// 	let start = { x: center + 180,   y: 420  };
		// 	let cp1 =   { x: this.x,   y: 590  };
		// 	let cp2 =   { x: this.x,   y: 390  };
		// 	let end =   { x: this.x,   y: 340 };
		//
		// 	c.beginPath();
		// 	c.moveTo(start.x, start.y);
		// 	c.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
		// 	c.stroke();
		// 	c.closePath();
		//
		// 	c.fillStyle = `rgba(0,0,0,${ isFuture ? opacity(this.x) : 0 })`;
		// 	c.beginPath();
		// 	c.moveTo(end.x + 6, end.y + 6);
		// 	c.lineTo(end.x, end.y);
		// 	c.lineTo(end.x - 6, end.y + 6);
		// 	c.stroke();
		// 	c.fill()
		// 	c.closePath();
		//
		// 	c.font = '14pt Arial';
		// 	c.lineWidth = 1;
		// 	c.fillStyle = `rgba(0,0,0,${ opacity(this.x) })`;
		// 	let text = 'Вот эта секунда больше никогда не повторится \n' +
		// 		' Она уникальная раз в жизни \n Её координаты ' + format(this.date, 'y.MM.dd..HH.mm.ss');
		//
		// 	if(isPast) {
		// 		text = 'Всё, она прошла'
		// 	}
		// 	printAtCenter(text, 400, 20);
		//
		// 	if(isFuture) {
		// 		const textTitle = 'Здесь ещё будущее';
		// 		const textSubTitle = 'На него можно повлиять\nЕсли делать дела';
		//
		// 		c.fillStyle = `rgba(0,0,0,${ opacity(this.x) })`;
		// 		c.font = '26pt Arial';
		// 		c.lineWidth = 2;
		// 		printAtRight(textTitle, 70, 100, 30);
		//
		// 		c.fillStyle = `rgba(0,0,0,${ opacity(this.x) - 0.2 })`;
		// 		c.font = '18pt Arial';
		// 		c.lineWidth = 1;
		// 		printAtRight(textSubTitle, 110, 100, 26);
		// 	}
		//
		// 	if(isPast) {
		// 		const textTitle = 'Тут уже прошлое';
		// 		const textSubTitle = 'Его не изменить, время прошло\nостались только история, опыт и воспоминания';
		// 		c.fillStyle = `rgba(0,0,0,${ opacity(this.x) })`;
		//
		// 		c.font = '26pt Arial';
		// 		c.lineWidth = 2;
		// 		printAtLeft(textTitle, 70, 100, 30);
		//
		// 		c.font = '18pt Arial';
		// 		c.lineWidth = 1;
		// 		printAtLeft(textSubTitle, 110, 100, 26);
		// 	}
		// }
	}
}


function setup() {
	const c = createCanvas(windowWidth, windowHeight);
	c.mouseClicked(mousePress);
	centerX = width / 2;
	centerY = height / 2;
	clock = new Clock();
	init()
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
}
function draw() {
	background(255);

	lines.forEach(line => {
		line.update()
	})
	clock.update();

}
function mousePress(event) {
}
function mouseWheel(event) {
	let delta = Math.round(event.delta);
	const lineLimit = 400
	if(delta > 0) {
		all_lines++;
		if(all_lines > lineLimit) {
			if(unit === SEC) {
				unit = MIN
				all_lines = Math.round(lineLimit / (MIN / 1000))
			}
			else if(unit === MIN) {
				unit = HOUR
				all_lines = Math.round(lineLimit / (HOUR / 1000))
			}
			else if(unit === HOUR) {
				unit = DAY
				all_lines = Math.round(lineLimit / (DAY / 1000))
			}
		}
	}
	if(delta < 0) {
		if(all_lines <= 10) {
			if(unit === DAY) {
				unit = HOUR
				all_lines = lineLimit
			}
			else if(unit === HOUR) {
				unit = MIN
				all_lines = lineLimit
			}
			else if(unit === MIN) {
				unit = SEC
				all_lines = lineLimit
			}
		}
		else {
			all_lines--;
		}
	}
	init()
}






function format(date) {
	// 'HH:mm:ss'
	const seconds = date.getSeconds();
	const minutes = date.getMinutes();
	const hours = date.getHours();
	if(unit === SEC) {
		return `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
	}
	else {
		return `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}`;
	}
}
const opacity = (currentX) => {
	const rightDiff = width - currentX;
	if(rightDiff < 100) {
		return rightDiff / 100;
	}

	const leftDiff = currentX;
	// const leftDiff = (0 - currentX)*-1;
	if(leftDiff < 100) {
		return leftDiff / 100;
	}

	return 1;
}
const printAtCenter = (text, y, lineHeight) => {
	const lines = text.split('\n');
	// const lineHeight = 15;

	for (let i = 0; i < lines.length; i++) {
		const textWidth = c.measureText(lines[i]).width;
		const x = centerX - (textWidth / 2);
		c.fillText(lines[i], x, y + (i*lineHeight) );
	}
}
const printAtLeft = (text, y, offset, lineHeight) => {
	const lines = text.split('\n');
	// const lineHeight = 16;

	for (let i = 0; i < lines.length; i++) {
		// const lineHeight = c.measureText(lines[i]).actualBoundingBoxDescent;
		c.fillText(lines[i], offset, y + (i * lineHeight));
	}
}
const printAtRight = (text, y, offset, lineHeight) => {
	const lines = text.split('\n');
	// const lineHeight = 16;

	for (let i = 0; i < lines.length; i++) {
		const lineWidth = textWidth(lines[i]);
		const x = width - lineWidth - offset;
		text(lines[i], x, y + (i * lineHeight));
	}
}