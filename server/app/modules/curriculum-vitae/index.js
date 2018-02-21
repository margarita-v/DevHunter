import Router from 'koa-router';
import Cv from './models';
import checkUser from '../../handlers/check-user';
import cvController from './controllers/cv-controller';

const router = new Router({ prefix: '/cv' });

router
    .post('/', checkUser(), cvController.create)
    .put('/:id', checkUser(), cvController.update)
    .delete('/:id', checkUser(), cvController.delete);

export {
    Cv,
};

export default router.routes();
