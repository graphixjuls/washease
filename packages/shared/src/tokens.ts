import rawTokens from '../../../design/tokens.json' with { type: 'json' };

export const tokens = rawTokens;

export const colors = rawTokens.color;
export const space = rawTokens.space;
export const radius = rawTokens.radius;
export const shadow = rawTokens.shadow;
export const font = rawTokens.font;
export const type = rawTokens.type;

export type ThemeMode = 'light' | 'dark';

export function getThemeColors(mode: ThemeMode) {
  return colors[mode];
}

