function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	// setup();
}

let lines = []
let clock;
let widthBetweenLines;
let all_lines = 30; // 1 minute = 60 sec
let center = 0;
let unit = 1000 // 1 sec difference between lines



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
		const x = center - (textWidth / 2);
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
function format(date) {
	// 'HH:mm:ss'
	const seconds = date.getSeconds();
	const minutes = date.getMinutes();
	const hours = date.getHours();
	return `${hours}:${minutes}:${seconds}`;
}

class LineNew {
	constructor(x, y) {
		this.x = Math.round(x);
		this.y = Math.round(y);
	}
	draw() {
		stroke('#000')
		noFill()
		circle(this.x, this.y, 10)
		noStroke()
		fill('#000')
		textFont('Arial', 30)
		// text(' ' + this.x, this.x, this.y)
		// text(' ' + this.y, this.x, this.y + 30)
	}
	drawLine(currentPointIndex) {
		stroke('#00f')
		line(this.x, this.y, points[currentPointIndex - 1].x, points[currentPointIndex - 1].y)
	}
}
// Objects
class Line {
	constructor(date) {
		this.date = date
		this.seconds = new Date(this.date).getSeconds();
		this.minutes = new Date(this.date).getMinutes();
		this.hours = new Date(this.date).getHours();
		this.isPast = false;
		this.isFuture = false;

		this.x = 0;

		this.yStart = 220;
		this.yEnd = 300;

		this.pxDiff = widthBetweenLines / unit; // сколько пикселей в одной милисекунде

		if(this.seconds === 0) {
			this.yStart = 200;

			if(this.minutes === 0) {
				this.yStart = 180;

				if(this.hours === 0) {
					this.yStart = 160;
				}
			}
		}
	}
	update() {
		this.pxDiff = widthBetweenLines / unit; // сколько пикселей в одной милисекунде
		const timeDiff = new Date - this.date;
		this.x = center - (timeDiff * this.pxDiff);
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
		// if(this.seconds !== 0){
		// 	return;
		// }
		if(this.isPast) {
			// past
			const color = '#7a795c';
			stroke(color)
			strokeWeight(1)
			fill(color)
		}
		if(this.isFuture) {
			// future
			const color = '#3780c9';
			stroke(color);
			// stroke('black');
			strokeWeight(2);
			fill(color);
		}

		line(this.x, this.yStart, this.x, this.yEnd)


		textFont('Arial', 8)
		noStroke()

		const tWidth = textWidth(`${this.seconds}`);
		// textAlign(CENTER);
		text(`${this.seconds}`, this.x - tWidth / 2, 314);

		// line(0, 37, width, 37);
		// textAlign(CENTER, CENTER);
		// text(`${this.hours}`, this.x, 314, width);


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
class Clock {
	now = new Date;
	update() {
		this.now = new Date;
		this.draw();
	}
	draw() {
		textFont('Arial', 12)
		const textString = format(this.now);
		const tWidth = textWidth(textString);

		// c.fillStyle = '#f2f4f6';





		rect(center - (tWidth / 2) - 10, height / 2, tWidth + 20, 30);
		fill('#b63737');

		// textFont('Arial', 20)
		text(textString, center - (tWidth / 2), 320);

		strokeWeight(2);
		arc(center, 260, tWidth + 30, 0, 0, PI * 2, PIE);
		fill('#000');
		arc(center, 260, tWidth + 22, 0, 0, PI, PIE);
		fill('#000');

		stroke('#000')
		fill('#000');
	}
}



function setup() {
	const c = createCanvas(windowWidth, windowHeight);
	c.mouseClicked(mousePress);
	center = width / 2;
	clock = new Clock();
	init()
}
function draw() {
	background(255);

	lines.forEach(line => {
		line.update()
	})
	clock.update();






	strokeWeight(2);
	// stroke('black');
	stroke('orange');
	line(center, 0, center, height)
	line(0, height / 2, width, height / 2)

}
function mousePress(event) {
}
function mouseWheel(event) {
	if(event.delta > 0) all_lines++;
	if(event.delta < 0) {
		if(all_lines > 4) all_lines--;
	}
	init()
}


function init() {
	widthBetweenLines = width / all_lines;


	const date_now = new Date;
	const date = Math.floor(date_now / 1000) * 1000 // - center

	let first_sec_on_display = date - (all_lines / 2) * unit
	lines = Array(all_lines).fill('').map((line, index) => {
		return new Line(first_sec_on_display + index * unit)
	});
}
