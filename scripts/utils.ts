import { centerX, gray, setGray, unit } from './variables';
import { SEC } from './constans';

export function format(date: number) {
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
export const printAtCenter = (str: string, y: number, lineHeight: number) => {
    const lines = str.split('\n');
    // const lineHeight = 15;

    for (let i = 0; i < lines.length; i++) {
        const txtWidth = textWidth(lines[i]);
        const x = centerX - (txtWidth / 2);
        text(lines[i], x, y + (i*lineHeight) );
    }
}
// const printAtLeft = (str, y, offset, lineHeight) => {
//     const lines = str.split('\n');
//     // const lineHeight = 16;
//
//     for (let i = 0; i < lines.length; i++) {
//         // const lineHeight = c.measureText(lines[i]).actualBoundingBoxDescent;
//         text(lines[i], offset, y + (i * lineHeight));
//     }
// }
// const printAtRight = (str, y, offset, lineHeight) => {
//     const lines = str.split('\n');
//     // const lineHeight = 16;
//
//     for (let i = 0; i < lines.length; i++) {
//         const lineWidth = textWidth(lines[i]);
//         const x = width - lineWidth - offset;
//         text(lines[i], x, y + (i * lineHeight));
//     }
// }

window.htmlFullScreen = () => {
    const html = document.documentElement;
    fullScreen(html);
}
const fullScreen = (element: Element) => {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.webkitrequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.mozRequestFullscreen) {
        element.mozRequestFullScreen();
    }
}

export const themeToggle = () => {
    if(gray === 245) setGray(45)
    else if(gray === 45) setGray(245)
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
