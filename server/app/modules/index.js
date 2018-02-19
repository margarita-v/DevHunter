import Router from 'koa-router';
import auth from './auth';
import cv from './curriculum-vitae';

const router = new Router({ prefix: '/api' });
router.use(auth);
router.use(cv);

export default router.routes();
