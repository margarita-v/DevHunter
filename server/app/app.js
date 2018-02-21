import Koa from 'koa';
import initHandlers from './handlers';
import initConnectors from './connectors';
import modules from './modules';
import AppError from './helpers/error';
import {returnResult} from './utils/common-utils';

initConnectors();
global.AppError = AppError;

const app = new Koa();
initHandlers(app);
app.use(modules);

app.use(async (ctx) => {
    returnResult(ctx, '<h1>Summary</h1>');
});

export default app;
