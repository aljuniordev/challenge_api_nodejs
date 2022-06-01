import { registerProviders, registeredProviders } from './providers';

const registeredDependencies = {
  ...registeredProviders,
};

function registerDependencies() {
  registerProviders();
}

export { registeredDependencies, registerDependencies };
