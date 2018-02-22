import Router from 'koa-router';
import auth from './auth';
import users from './users';
import cv from './curriculum-vitae';

const router = new Router({ prefix: '/api' });
router.use(auth);
router.use(cv);
router.use(users);

export default router.routes();
