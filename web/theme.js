import Color from 'color';
import _ from 'lodash';

function createVariants(name, c) {
  return {
    [name + 'Str']: c.rgbaString(),
    [name + 'C']: _.constant(c.rgbaString()),
    [name + 'Raw']: c,
  };
}

const bgColor = Color().rgb(0, 0, 17);
const blue = Color('#330099');
const grey = Color('#AAAABD');
var colors = {
  backgroundColorInt: (bgColor.red() << 16) + (bgColor.green() << 8) + bgColor.blue(),
  backgroundColor: bgColor.hexString(),

  ...createVariants('blue', blue),
  borderBlue: blue.clone().darken(0.2).rgbaString(),
  bgBlue: blue.clone().alpha(0.3).rgbaString(),

  ...createVariants('moderateBlue', Color('#244665')),
  ...createVariants('targetRed',  Color('#d61c00')),

  ...createVariants('textLight', Color('#BEC0C1')),

  ...createVariants('grey', grey),
  bottomBarGrey: grey.clone().alpha(0.4).rgbaString(),

  ...createVariants('teal', Color('#00c5ff')),

  ...createVariants('black', Color('#070200')),

  ...createVariants('greenReady', Color('#00ff00')),
  ...createVariants('redReady', Color('#ff0000')),

  ...createVariants('yellowMana', Color('#98751E')),
  ...createVariants('blueMana', Color('#337eff')),
  ...createVariants('redMana',  Color('#e62c00')),

  ...createVariants('health', Color('#ff0000')),
  ...createVariants('purple', Color('#A61FDE')),

  players: ['#ff8080', '#789cf0', '#b0de6f', '#cc66c0', '#5dbaab', '#f2ba79', '#8e71e3', '#6ed169'],
};

module.exports = colors;
