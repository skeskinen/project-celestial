import Color from 'color';

var bgColor = Color().rgb(0, 0, 17);
export const backgroundColorInt = (bgColor.red() << 16) + (bgColor.green() << 8) + bgColor.blue();
export const backgroundColor = bgColor.hexString();

export const baseBlue = Color('#330099');
export const borderBlue = baseBlue.clone().darken(0.2).hexString();
export const bgBlue = baseBlue.clone().alpha(0.3).rgbaString();

export const textLight = '#BEC0C1';
