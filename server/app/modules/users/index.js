import User from './models';
import Router from 'koa-router';
import userController from './controllers/user-controller';
import checkUser from '../../handlers/check-user';

const router = new Router({ prefix: '/users' });

router
    .get('/current-user', checkUser(), userController.getCurrentUser);

export {
    User,
};

export default router.routes();
