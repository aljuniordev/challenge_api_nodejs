import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors';
import { IDateProvider } from '@shared/containers/providers';

import { ICheckBarcodeDTORet } from '@modules/bankSlip/dtos';
import { regexFindDotOnText, regexOnlyNumbersAndSize47 } from '@utils/regexSamples';

interface IRequest {
  barcode: string;
}

@injectable()
class CheckBarcodeUseCase {
  constructor(
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ barcode: barcodeRaw }: IRequest): Promise<ICheckBarcodeDTORet> {
    if (!barcodeRaw) {
      throw new AppError('missing_parameters', 'BAD_REQUEST');
    }

    const barcode = barcodeRaw.replace(regexFindDotOnText, '');

    if (!regexOnlyNumbersAndSize47.test(barcode)) {
      throw new AppError('incorrect_parameters', 'BAD_REQUEST');
    }

    const fields = [
      {
        num: barcode.substring(0, 9),
        dv: barcode.substring(9, 10),
      },
      {
        num: barcode.substring(10, 20),
        dv: barcode.substring(20, 21),
      },
      {
        num: barcode.substring(21, 31),
        dv: barcode.substring(31, 32),
      },
    ];

    const fieldsAreTrue = fields.every(
      field => this.verifyingDigitModule10(field.num) === Number(field.dv),
    );

    if (!fieldsAreTrue) {
      throw new AppError('barcode_dont_valid', 'BAD_REQUEST');
    }

    return {
      amount: '1',
      expirationDate: this.dateProvider.dateNow().toISOString(),
      barCode: barcode,
    };
  }

  /*
    ANEXO IV – CÁLCULO DO DÍGITO VERIFICADOR (DV) DA LINHA DIGITÁVEL (MÓDULO 10)
    A representação numérica do código de barras é composta, por cinco campos, sendo os
    três primeiros amarrados por DVs e calculados pelo módulo 10, conforme segue:
    a) O módulo 10 deverá ser utilizado para calcular o DV dos 03 (três) primeiros campos
    da linha digitável;
    b) Os multiplicadores começam com o número 2 (dois), sempre pela direita, alternando-
    se 1 e 2;
    c) Multiplicar cada algarismo que compõe o número pelo seu respectivo peso
    (multiplicador):
    d) Caso o resultado da multiplicação seja maior que 9 (nove) deverão ser somados os
    algarismos do produto, até reduzi-lo a um único algarismo:
    a. Exemplo: Resultado igual a 18, então 1+8 = 9
    e) Subtrair o total apurado no item anterior, da dezena imediatamente superior ao total
    apurado:
    a. Exemplo: Resultado da soma igual a 25, então 30 - 25
    f) O resultado obtido será o dígito verificador do número;
    a. Exemplo: 30-25 = 5 então 5 é o Dígito Verificador
    g) Se o resultado da subtração for igual a 10 (dez), o dígito verificador será igual a 0
    (zero).
  */
  verifyingDigitModule10(digitableLine: string) {
    const digitableLineOnArray = digitableLine.split('').reverse();
    const totalCalculated = digitableLineOnArray.reduce((acc, current, index) => {
      //prevent zero index
      const preventZeroIndex = index + 1;
      //if even then remainer 1
      //else odd then remainer 0
      const evenOrOdd = preventZeroIndex % 2;
      //without +1 starts with 1 and the same way
      //when evenOrOdd is 0 with +1 follow the documentation b)
      const multipliers = evenOrOdd + 1;

      // documentation c)
      let sum = Number(current) * multipliers;

      //documentation d)
      if (sum > 9) {
        // getting first number using trunc after multiplying for 10 the number
        // turns to into a decimal number
        const firstNumber = Math.trunc(sum / 10);
        // getting secound number using remainder sum
        const secoundNumber = sum % 10;
        sum = firstNumber + secoundNumber;
      }

      return acc + sum;
    }, 0);

    //getting next ten of total calculated
    const nextTenOfTotal = Math.ceil(totalCalculated / 10) * 10;

    //documentation e)
    //calculating verifying digit
    let verifyingDigit = nextTenOfTotal - totalCalculated;

    // documentation g)
    if (verifyingDigit === 10) {
      verifyingDigit = 0;
    }

    return verifyingDigit;
  }
}

export { CheckBarcodeUseCase };
