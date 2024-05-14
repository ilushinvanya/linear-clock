export let note1: any;
export const setNote1 = (val: any) => { note1 = val };

export let note2: any;
export const setNote2 = (val: any) => { note2 = val };


export let lines: any[] = []
export const setLines = (val: any[]) => { lines = val };


export let clock: any;
export const setClock = (val: any) => { clock = val };

export let centerX = 0;
export const setCenterX = (val: number) => { centerX = val };

export let centerY = 0;
export const setCenterY = (val: number) => { centerY = val };

export let textLineCenterY = 0;
export const setTextLineCenterY = (val: number) => { textLineCenterY = val };

export let widthBetweenLines = 0;
export const setWidthBetweenLines = (val: number) => { widthBetweenLines = val };



export let linesCount = 21; // 1 minute = 60 sec
export const setLinesCount = (val: number) => {
	if(val < 1) linesCount = 1
	else linesCount = val
};



export let unit = 1000 // 1 sec difference between lines
export const setUnit = (val: number) => { unit = val };


export let gray = 245;
export const setGray = (val: number) => { gray = val };

export let isActiveVibrate = true;
export const setActiveVibrate = (val: boolean) => { isActiveVibrate = val };

const navigatorLanguage = window.navigator.language;
const userLanguage = navigatorLanguage.substring(0, 2)

export let lang: 'ru' | 'en' | 'es' = 'ru';

if(userLanguage === 'en') lang = 'en'
else if(userLanguage === 'es') lang = 'es'

export const setLang = (val: 'ru' | 'en' | 'es') => { lang = val };
