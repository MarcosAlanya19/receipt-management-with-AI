import { MatchesRegexp } from 'encore.dev/validate';

type RUC = string & MatchesRegexp<'^[1|2]\\d{10}$'>;
type DNI = string & MatchesRegexp<'^\\d{8}$'>;

export interface ISunatValidationDto {
  type: 'RUC' | 'DNI';
  value: RUC | DNI;
}
