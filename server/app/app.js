import Koa from 'koa';
import initHandlers from './handlers';
import initConnectors from './connectors';

initConnectors();

const app = new Koa();
initHandlers(app);

app.use(async (ctx) => {
    ctx.body = '<h1>Summary</h1>';
});

export default app;
