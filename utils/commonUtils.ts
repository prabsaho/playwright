// Timeouts
export enum Timeouts {
  DefaultWaitTime = 30000,
  FourMinutesTime = 240000,
  OneMinuteTime = 60000,
  ShortWaitTime = 5000,
  SixMinutesTime = 360000,
  TenSecondsTime = 10000,
}

export function isRevisionPatternValid(
  revisionString: string,
  pattern: RegExp
): boolean {
  return pattern.test(revisionString);
}


