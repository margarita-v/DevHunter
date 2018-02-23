import Router from 'koa-router';
import Cv from './models';
import {checkUser} from '../users/handlers/user-handlers';
import cvController from './controllers/cv-controller';

const router = new Router({ prefix: '/cv' });

router
    .get('/', cvController.search)
    .post('/', checkUser(), cvController.create)
    .get('/:hash', checkUser(), cvController.get)
    .put('/:hash', checkUser(), cvController.update)
    .delete('/:hash', checkUser(), cvController.delete);

export {
    Cv,
};

export default router.routes();
