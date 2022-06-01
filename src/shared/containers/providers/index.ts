import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/model/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';

const registeredProviders = {
  dateProvider: 'DateProvider',
} as const;

function registerProviders() {
  container.registerSingleton<IDateProvider>(
    registeredProviders.dateProvider,
    DayjsDateProvider,
  );
}

export * from './DateProvider/implementations/DayjsDateProvider';
export * from './DateProvider/model/IDateProvider';

export { registeredProviders, registerProviders };
