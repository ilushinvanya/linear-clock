import ru from './ru';
import en from './en';
import es from './es';

declare global {
    interface Window {
        TURN_STRING: string;
        OR_STRING: string;
        BUTTON_STRING: string;
        FSMODE_STRING: string;
        FS_BUTTON: string;
        THEME_BUTTON: string;
        VIBRATE_BUTTON: string;
    }
}

export default {
    ru, en, es
}
