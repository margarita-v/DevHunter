import Router from 'koa-router';
import authController from './controllers/auth-controller';
import {checkUser} from '../users/handlers/user-handlers';

const router = new Router({ prefix: '/auth' });

router
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn)
    .get('/user', checkUser(), authController.getCurrentUser);

export default router.routes();
