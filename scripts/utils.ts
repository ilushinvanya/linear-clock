import type { p5InstanceExtensions } from 'p5';
import { centerX, gray, setGray, setLang, unit, lang, isActiveVibrate, setActiveVibrate } from './variables';
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

    const month = new Date(date).getMonth() + 1;
    const monthText = toText(month);

    const year = new Date(date).getFullYear();

    let clockText = `${hourText}:${minuteText}`;
    if(fullDate) {
        return `${year}.${monthText}.${dayText}-${clockText}:${secondText}`
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
            .then(() => {
                document.getElementById('fullscreenBtn')?.classList.remove('active')
            })
            .catch((err) => console.error(err));
    } else {
        fullScreen(html);
        document.getElementById('fullscreenBtn')?.classList.add('active')
    }
}
const fullScreen = (element: Element) => {
    if(element.requestFullscreen) {
        element.requestFullscreen();
        // @ts-ignore
    } else if(element.webkitrequestFullscreen) {
        // @ts-ignore
        element.webkitRequestFullscreen();
        // @ts-ignore
    } else if(element.mozRequestFullscreen) {
        // @ts-ignore
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
        document.getElementById('themeBtn')?.classList.add('active')
    }
    else if(gray === 45) {
        setGray(245)
        document.getElementById('tools')?.classList.remove('dark')
        document.getElementById('themeBtn')?.classList.remove('active')
    }
}

let prevTime = Date.now(),
	frames = 0;
export function fpsMeterLoop() {
	const time = Date.now();
	frames++;
	if (time > prevTime + 1000) {
		let fps = Math.round((frames * 1000) / (time - prevTime));
		prevTime = time;
		frames = 0;
		return fps;
	}
}

export function normalizeTime(target: number = Date.now(), normal: number = unit) {
    return Math.floor( target / normal) * normal
}

export function languageToggle() {
    if (lang === 'ru') setLang('en');
    else if (lang === 'en') setLang('ru');
}

export function toggleActiveVibrate() {
    if (isActiveVibrate) {
        document.getElementById('vibrateBtn')?.classList.add('active');
        setActiveVibrate(false);
    }
    else if (!isActiveVibrate) {
        document.getElementById('vibrateBtn')?.classList.remove('active');
        setActiveVibrate(true);
    }
}
