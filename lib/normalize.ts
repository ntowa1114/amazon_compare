import { NormalizedSpec } from './types';

export function normalizeSize(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'mm';

  const mmMatch = cleaned.match(/([\d.]+)mm/);
  if (mmMatch) {
    normalizedValue = parseFloat(mmMatch[1]);
  }

  const cmMatch = cleaned.match(/([\d.]+)cm/);
  if (cmMatch) {
    normalizedValue = parseFloat(cmMatch[1]) * 10;
  }

  const inchMatch = cleaned.match(/([\d.]+)(in|inch|インチ|")/);
  if (inchMatch) {
    normalizedValue = parseFloat(inchMatch[1]) * 25.4;
  }

  const mMatch = cleaned.match(/([\d.]+)m(?!m)/);
  if (mMatch && !mmMatch) {
    normalizedValue = parseFloat(mMatch[1]) * 1000;
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizeWeight(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'g';

  const gMatch = cleaned.match(/([\d.]+)g(?!ram)/);
  if (gMatch) {
    normalizedValue = parseFloat(gMatch[1]);
  }

  const kgMatch = cleaned.match(/([\d.]+)kg/);
  if (kgMatch) {
    normalizedValue = parseFloat(kgMatch[1]) * 1000;
  }

  const lbMatch = cleaned.match(/([\d.]+)(lb|lbs|ポンド)/);
  if (lbMatch) {
    normalizedValue = parseFloat(lbMatch[1]) * 453.592;
  }

  const ozMatch = cleaned.match(/([\d.]+)(oz|オンス)/);
  if (ozMatch) {
    normalizedValue = parseFloat(ozMatch[1]) * 28.3495;
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizePower(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'W';

  const wMatch = cleaned.match(/([\d.]+)w(?!h)/);
  if (wMatch) {
    normalizedValue = parseFloat(wMatch[1]);
  }

  const kwMatch = cleaned.match(/([\d.]+)kw/);
  if (kwMatch) {
    normalizedValue = parseFloat(kwMatch[1]) * 1000;
  }

  const mwMatch = cleaned.match(/([\d.]+)mw/);
  if (mwMatch) {
    normalizedValue = parseFloat(mwMatch[1]) / 1000;
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizeCapacity(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'MB';

  const gbMatch = cleaned.match(/([\d.]+)gb/);
  if (gbMatch) {
    normalizedValue = parseFloat(gbMatch[1]) * 1024;
  }

  const tbMatch = cleaned.match(/([\d.]+)tb/);
  if (tbMatch) {
    normalizedValue = parseFloat(tbMatch[1]) * 1024 * 1024;
  }

  const mbMatch = cleaned.match(/([\d.]+)mb/);
  if (mbMatch) {
    normalizedValue = parseFloat(mbMatch[1]);
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizeResolution(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'pixels';

  const resMatch = cleaned.match(/([\d]+)x([\d]+)/);
  if (resMatch) {
    normalizedValue = parseInt(resMatch[1]) * parseInt(resMatch[2]);
  }

  const pMatch = cleaned.match(/([\d]+)p/);
  if (pMatch) {
    const height = parseInt(pMatch[1]);
    normalizedValue = height * (height * 16 / 9);
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizeRefreshRate(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'Hz';

  const hzMatch = cleaned.match(/([\d.]+)hz/);
  if (hzMatch) {
    normalizedValue = parseFloat(hzMatch[1]);
  }

  return { rawValue: value, normalizedValue, unit };
}

export function normalizeSpeed(value: string): NormalizedSpec {
  const cleaned = value.toLowerCase().replace(/[,\s]/g, '');

  let normalizedValue: number | null = null;
  let unit = 'Mbps';

  const gbpsMatch = cleaned.match(/([\d.]+)gbps/);
  if (gbpsMatch) {
    normalizedValue = parseFloat(gbpsMatch[1]) * 1000;
  }

  const mbpsMatch = cleaned.match(/([\d.]+)mbps/);
  if (mbpsMatch) {
    normalizedValue = parseFloat(mbpsMatch[1]);
  }

  return { rawValue: value, normalizedValue, unit };
}

export function extractNumericValue(value: string): number | null {
  const cleaned = value.replace(/[,\s]/g, '');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}
