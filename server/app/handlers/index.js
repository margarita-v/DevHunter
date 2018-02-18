import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { IS_DEV } from '../utils/env';
import handleServerError from './error';
import verifyUser from './jwt';

/**
 * Function which configures handlers for an application instance
 */
export default function initHandlers(app) {
    // Enable logger for development only, not for production
    if (IS_DEV) {
        app.use(logger());
    }
    app.use(handleServerError());
    app.use(verifyUser());
    app.use(bodyParser());
}
