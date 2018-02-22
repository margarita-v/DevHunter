import User from './models';
import Router from 'koa-router';
import userController from './controllers/user-controller';
import {checkUser, findUserByHash} from './handlers/user-handlers';

const router = new Router({ prefix: '/users' });

router
    .get('/current-user', checkUser(), userController.getCurrentUser)
    .param('hash', findUserByHash())
    .get('/:hash/all-cv', userController.getAllCvByUserHash);

export {
    User,
};

export default router.routes();
