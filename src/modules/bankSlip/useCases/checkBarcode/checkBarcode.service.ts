import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors";
import { IDateProvider } from "../../../../shared/containers/providers";

import { ICheckBarcodeDTORet } from "@modules/bankSlip/dtos";
import {
  regexFindDotOnText,
  regexOnlyNumbersAndSize47,
  regexLeadingZeros,
} from "../../../../utils/regexSamples";

interface IRequest {
  barcode: string;
}

interface IFieldsOfBarcode {
  num: string;
  dv: string;
}

@injectable()
class CheckBarcodeUseCase {
  constructor(
    @inject("DateProvider")
    private dateProvider: IDateProvider,
  ) {}

  async checkBarcode({ barcode: barcodeRaw }: IRequest): Promise<ICheckBarcodeDTORet> {
    try {
      if (!barcodeRaw) {
        throw new AppError("missing_parameters", "BAD_REQUEST");
      }

      const barcode = barcodeRaw.replace(regexFindDotOnText, "");

      if (!regexOnlyNumbersAndSize47.test(barcode)) {
        throw new AppError("incorrect_parameters", "BAD_REQUEST");
      }

      const value = this.getValueOfBarcode(barcode);

      const expirationDate = this.getDateOfBarcode(barcode);

      const fieldsOfBarcode = this.getFieldsOfBarcode(barcode);
      const fieldsAreTrue = fieldsOfBarcode.every(
        field => this.verifyingDigitModule10(field.num) === Number(field.dv),
      );

      if (!fieldsAreTrue) {
        throw new AppError("barcode_dont_valid", "BAD_REQUEST");
      }

      return {
        amount: value,
        expirationDate: this.dateProvider.dateToString(expirationDate, "DD/MM/YYYY"),
        barCode: barcode,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error, "BAD_REQUEST");
      } else {
        throw error;
      }
    }
  }

  getFieldsOfBarcode(barcode: string): IFieldsOfBarcode[] {
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

    return fields;
  }
  /*
    ANEXO IV ??? C??LCULO DO D??GITO VERIFICADOR (DV) DA LINHA DIGIT??VEL (M??DULO 10)
    A representa????o num??rica do c??digo de barras ?? composta, por cinco campos, sendo os
    tr??s primeiros amarrados por DVs e calculados pelo m??dulo 10, conforme segue:
    a) O m??dulo 10 dever?? ser utilizado para calcular o DV dos 03 (tr??s) primeiros campos
    da linha digit??vel;
    b) Os multiplicadores come??am com o n??mero 2 (dois), sempre pela direita, alternando-
    se 1 e 2;
    c) Multiplicar cada algarismo que comp??e o n??mero pelo seu respectivo peso
    (multiplicador):
    d) Caso o resultado da multiplica????o seja maior que 9 (nove) dever??o ser somados os
    algarismos do produto, at?? reduzi-lo a um ??nico algarismo:
    a. Exemplo: Resultado igual a 18, ent??o 1+8 = 9
    e) Subtrair o total apurado no item anterior, da dezena imediatamente superior ao total
    apurado:
    a. Exemplo: Resultado da soma igual a 25, ent??o 30 - 25
    f) O resultado obtido ser?? o d??gito verificador do n??mero;
    a. Exemplo: 30-25 = 5 ent??o 5 ?? o D??gito Verificador
    g) Se o resultado da subtra????o for igual a 10 (dez), o d??gito verificador ser?? igual a 0
    (zero).
  */
  verifyingDigitModule10(digitableLine: string) {
    const digitableLineOnArray = digitableLine.split("").reverse();
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

  getValueOfBarcode(barcode: string): string {
    const valueRaw = barcode.substring(37, 47).replace(regexLeadingZeros, "");

    const value =
      valueRaw.substring(0, valueRaw.length - 2) +
      "," +
      valueRaw.substring(valueRaw.length - 2, valueRaw.length);

    return value;
  }

  getDateOfBarcode(barcode: string): Date {
    const expirationDateOfBarcode = +barcode.slice(33, 37);

    const milis = expirationDateOfBarcode * 24 * 60 * 60 * 1000;

    const parameterDate = new Date("10/07/1997");
    const expirationDate = this.dateProvider.addMilliseconds(parameterDate, milis);

    return expirationDate;
  }
}

export { CheckBarcodeUseCase };
