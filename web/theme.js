import Color from 'color';

var bgColor = Color().rgb(0, 0, 17);
export const backgroundColorInt = (bgColor.red() << 16) + (bgColor.green() << 8) + bgColor.blue();
export const backgroundColor = bgColor.hexString();

export const blue = Color('#330099');
export const borderBlue = blue.clone().darken(0.2).rgbaString();
export const bgBlue = blue.clone().alpha(0.3).rgbaString();

export const moderateBlue = Color('#244665');

export const textLight = '#BEC0C1';

export const grey = Color('#AAAABD');
export const bottomBarGrey = grey.clone().alpha(0.4).rgbaString();

export const teal = Color('#00c5ff');

export const black = Color('#070200');

export const yellowMana = Color('#98751E');
export const blueMana = Color('#337eff');
export const redMana = Color('#e62c00');

export const health = Color('#ff0000');
export const purple = Color('#A61FDE');
