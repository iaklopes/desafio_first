import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: string, countryCode: string): string {
    if (!value) {
      return value;
    }

    // Remove qualquer caractere que não seja um dígito
    const formatted = value.replace(/\D/g, '');

    if (countryCode === '55') {
      // Se o comprimento for 11, assume-se que seja um celular
      if (formatted.length === 11) {
        return `+${countryCode} (${formatted.slice(0, 2)}) ${formatted.slice(2, 7)}-${formatted.slice(7)}`;
      }
      // Se o comprimento for 10, assume-se que seja um telefone fixo
      else if (formatted.length === 10) {
        return `+${countryCode} (${formatted.slice(0, 2)}) ${formatted.slice(2, 6)}-${formatted.slice(6)}`;
      }
    } else {
      // Formatação padrão para outros países
      return `+${countryCode} ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6)}`;
    }

    // Se não for um número do Brasil e não tiver uma formatação específica, retorna como está.
    return value;
  }
}
