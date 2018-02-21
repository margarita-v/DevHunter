import Router from 'koa-router';
import authController from './controllers/auth-controller';
import checkUser from '../../handlers/check-user';
import {returnResult} from '../../utils/common-utils';

const router = new Router({ prefix: '/auth' });

router
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn)
    .post('/private', checkUser(), (ctx) => {
        returnResult(ctx, ctx.user);
    });

export default router.routes();
