import Router from 'koa-router';
import authController from './controllers/auth-controller';

const router = new Router({ prefix: '/auth' });

router
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn)
    .post('/private', (ctx) => {
        if (!ctx.user) {
            ctx.throw(403, { message: 'Forbidden' });
        }
        ctx.body = ctx.user;
    });

export default router.routes();
