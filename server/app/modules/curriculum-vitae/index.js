import Router from 'koa-router';
import Cv from './models';
import checkUser from '../../handlers/check-user';
import cvController from './controllers/cv-controller';

const router = new Router({ prefix: '/cv' });

router
    .post('/', checkUser(), cvController.create);

export {
    Cv,
};

export default router.routes();
