import User from './models';
import Router from 'koa-router';
import userController from './controllers/user-controller';
import checkUser from './handlers/check-user';
import checkUserByHash from './handlers/check-user-by-hash';

const router = new Router({ prefix: '/users' });

router
    .get('/current-user', checkUser(), userController.getCurrentUser)
    .param('hash', checkUserByHash())
    .get('/:hash/all-cv', userController.getAllCvByUserHash);

export {
    User,
};

export default router.routes();
