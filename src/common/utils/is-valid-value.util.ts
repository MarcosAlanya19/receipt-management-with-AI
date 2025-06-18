export function isValidValue(value: any): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'boolean') return true;

  return false;
}
