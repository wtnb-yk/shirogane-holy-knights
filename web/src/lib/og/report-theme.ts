import { OG } from './base-template';

export type OgReportTheme = {
  bg: string;
  bgStyle: string;
  border: string;
  heading: string;
  sub: string;
  accent: string;
  cellBg: string;
  cellBorder: string;
  cellLabel: string;
  cellVal: string;
  barBg: string;
  barFill: string;
  barTop: string;
  footerText: string;
  line: string;
  monoLabel: string;
  icon: string;
};

const LIGHT: OgReportTheme = {
  bg: OG.cream50,
  bgStyle: OG.cream50,
  border: '#E2E2E6',
  heading: OG.dark800,
  sub: OG.navy300,
  accent: '#A6852E',
  cellBg: OG.cream100,
  cellBorder: '#E2E2E6',
  cellLabel: '#6A7380',
  cellVal: OG.dark800,
  barBg: '#EDEDF0',
  barFill: OG.gold400,
  barTop: '#A6852E',
  footerText: OG.navy300,
  line: OG.gold400,
  monoLabel: '#A6852E',
  icon: '#BBB4B8',
};

const DARK: OgReportTheme = {
  bg: '#242A3A',
  bgStyle: '#242A3A',
  border: '#404A55',
  heading: '#E8E8EC',
  sub: '#6A7380',
  accent: OG.gold300,
  cellBg: 'rgba(255,255,255,0.03)',
  cellBorder: '#404A55',
  cellLabel: '#6A7380',
  cellVal: '#EDEDF0',
  barBg: '#404A55',
  barFill: OG.gold400,
  barTop: OG.gold300,
  footerText: '#6A7380',
  line: OG.gold400,
  monoLabel: OG.gold300,
  icon: '#6A7380',
};

const GOLD: OgReportTheme = {
  bg: '#FBF6EC',
  bgStyle: 'linear-gradient(170deg, #FBF6EC 0%, #F5EDD8 100%)',
  border: '#E2CC92',
  heading: OG.dark800,
  sub: OG.gold400,
  accent: '#8B6D1E',
  cellBg: 'rgba(200,162,76,0.06)',
  cellBorder: '#E2CC92',
  cellLabel: '#A6852E',
  cellVal: OG.dark800,
  barBg: '#F2E6C4',
  barFill: '#A6852E',
  barTop: '#8B6D1E',
  footerText: '#A6852E',
  line: '#A6852E',
  monoLabel: '#8B6D1E',
  icon: OG.gold300,
};

const THEMES: Record<string, OgReportTheme> = { l: LIGHT, d: DARK, g: GOLD };

export function getOgReportTheme(key: string): OgReportTheme {
  return THEMES[key] ?? LIGHT;
}

export const GENRE_COLORS = [
  '#C8A24C',
  '#6A7380',
  '#ACB1B8',
  '#D4B56A',
  '#E2E2E6',
];
