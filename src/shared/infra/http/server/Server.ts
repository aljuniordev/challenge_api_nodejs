import express, { Express } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from 'swaggerFile';
import helmet from 'helmet';

import { registerDependencies } from '@shared/containers';
import { router } from '../routes/index.routes';
import { generalErrorHandler } from '../middlewares/generalErrorHandler';

class Server {
  public app: Express;

  constructor() {
    registerDependencies();
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  private routes() {
    this.app.use(router);
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(
      helmet.hsts({
        maxAge: 31536000,
      }),
    );
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }

  private errorHandlers() {
    this.app.use(generalErrorHandler);
  }

  public async start() {
    this.app.listen(8080, () => console.log(`It's a live!!!`));
  }
}

export const server = new Server();
