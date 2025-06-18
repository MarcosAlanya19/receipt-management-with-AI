import { Settings } from 'luxon';

export const configureLuxon = () => {
  Settings.defaultZone = 'America/Lima';
  Settings.defaultLocale = 'es';
};
