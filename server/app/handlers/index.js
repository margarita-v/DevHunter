import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import error from './error';
import jwt from './jwt';
import { IS_DEV } from '../utils/env';

/**
 * Function which configures handlers for an application instance
 */
export default (app) => {
    // Enable logger for development only, not for production
    if (IS_DEV) {
        app.use(logger());
    }
    app.use(error());
    app.use(jwt());
    app.use(bodyParser());
};
