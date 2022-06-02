import "reflect-metadata";
import {
  DayjsDateProvider,
  IDateProvider,
} from "../../../../shared/containers/providers/";
import { CheckBarcodeUseCase } from "./checkBarcode.service";

let dateProvider: IDateProvider;
let checkBarcodeUseCase: CheckBarcodeUseCase;

describe("Check Barcode", () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    checkBarcodeUseCase = new CheckBarcodeUseCase(dateProvider);
  });

  it("Check simple barcode is valid", async () => {
    const barcode = "00190500954014481606906809350314311000000000100";

    const ret = await checkBarcodeUseCase.checkBarcode({ barcode });

    expect(ret).toEqual({
      amount: "1,00",
      barCode: "00190500954014481606906809350314311000000000100",
      expirationDate: "11/10/2000",
    });
  });

  it("Check barcode with whitespace and dot is valid", async () => {
    const barcode = "00190.50095 40144.816069 06809.350314 3 37370000000100";

    const ret = await checkBarcodeUseCase.checkBarcode({ barcode });

    expect(ret).toEqual({
      amount: "1,00",
      barCode: "00190500954014481606906809350314337370000000100",
      expirationDate: "31/12/2007",
    });
  });
});
