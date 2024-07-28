/**
 * Defines the logging level. The level is in order of priority, Debug being
 * the lowest and Silent being the highest. If Silent is chosen, logs should
 * never be sent.
 */
export type Level = 'silent' | 'error' | 'warn' | 'access' | 'info' | 'debug';

export const severity: { [key in Level]: number } = {
  silent: 0,
  error: 1,
  warn: 2,
  access: 3,
  info: 4,
  debug: 5,
};

/**
 * Get the severity equivalent of the provided level name.
 * @param level - Log level name to convert.
 */
export function toSeverity(level: Level): number {
  return severity[level];
}
