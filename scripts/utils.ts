import type { p5InstanceExtensions } from 'p5';
import { centerX, gray, setGray, unit } from './variables';
import { SEC } from './constans';

export function format(date: number, fullDate: boolean = false) {
    // 'HH:mm:ss'
    // 'y.MM.dd.HH.mm.ss'
    function toText(value: number) {
        return value >= 10 ? value : '0' + value;
    }
    const seconds = new Date(date).getSeconds();
    const secondText = toText(seconds);

    const minutes = new Date(date).getMinutes();
    const minuteText = toText(minutes);

    const hours = new Date(date).getHours();
    const hourText = toText(hours);

    const day = new Date(date).getDate();
    const dayText = toText(day);

    const month = new Date(date).getMonth();
    const monthText = toText(month);

    const year = new Date(date).getFullYear();

    let clockText = `${hourText}:${minuteText}`;
    if(fullDate) {
        return `${year}.${monthText}.${dayText} ${clockText}:${secondText}`
    }
    if(unit === SEC) {
        clockText = `${clockText}:${secondText}`;
    }
    return clockText;
}
export const opacity = (currentX: number) => {
    const rightDiff = (centerX * 2) - currentX;
    if(rightDiff < 100) {
        return rightDiff / 100;
    }
    const leftDiff = currentX;
    if(leftDiff < 100) {
        return leftDiff / 100;
    }
    return 1;
}
export const generateColorWOpacity = (r:number,g:number,b:number, x:number) => {
    return `rgba(${r},${g},${b},${ opacity(x) })`;
}
export const printAtCenter = (str: string, y: number, lineHeight: number, c: p5InstanceExtensions) => {
    const lines = str.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const txtWidth = c.textWidth(lines[i]);
        const x = centerX - (txtWidth / 2);
        c.text(lines[i], x, y + (i*lineHeight) );
    }
}

export const htmlFullScreen = () => {
    const html = document.documentElement;
    if (document.fullscreenElement) {
        document
            .exitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
    } else {
        fullScreen(html);
    }
}
const fullScreen = (element: Element) => {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.webkitrequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.mozRequestFullscreen) {
        element.mozRequestFullScreen();
    }
    if('orientation' in screen) {
        screen.orientation.lock('landscape');
    }
}

export const themeToggle = () => {
    if(gray === 245) {
        setGray(45)
        document.getElementById('tools')?.classList.add('dark')
    }
    else if(gray === 45) {
        setGray(245)
        document.getElementById('tools')?.classList.remove('dark')
    }
}

let prevTime = Date.now(),
	frames = 0;
function fpsMeterLoop() {
	const time = Date.now();
	frames++;
	if (time > prevTime + 1000) {
		let fps = Math.round((frames * 1000) / (time - prevTime));
		prevTime = time;
		frames = 0;
		return fps;
	}
}
