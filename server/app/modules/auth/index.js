import Router from 'koa-router';
import authController from './controllers/auth-controller';

const router = new Router({ prefix: '/auth' });

router
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn);

export default router.routes();
