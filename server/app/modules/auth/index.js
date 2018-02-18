import Router from 'koa-router';
import authController from './controllers/auth-controller';
import checkUser from '../../handlers/check-user';

const router = new Router({ prefix: '/auth' });

router
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn)
    .post('/private', checkUser(), (ctx) => {
        ctx.body = ctx.user;
    });

export default router.routes();
