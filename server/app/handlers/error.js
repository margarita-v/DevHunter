import {DEFAULT_ERROR_CODE, SERVER_ERROR_CODE} from '../utils/status-codes';

/**
 * Function for handling server errors
 */
export default function handleServerError() {
    return async (ctx, next) => {
        try {
            await next();
        } catch ({ status = SERVER_ERROR_CODE, message = 'Server error', name, errors}) {
            // Mongoose validation error
            if (name === 'ValidationError') {
                ctx.status = DEFAULT_ERROR_CODE;
                ctx.body = {
                    errors: Object.values(errors)
                        .reduce((errors, error) => ({
                            ...errors,
                            [error.path]: error.message,
                        }), {}),
                };
            } else {
                ctx.status = status;
                ctx.body = { status, message };
            }
        }
    };
}
