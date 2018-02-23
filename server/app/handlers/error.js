import {DEFAULT_ERROR_CODE, SERVER_ERROR_CODE} from '../constants/status-codes';
import {returnResult} from '../utils/common-utils';

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
                returnResult(ctx, {
                        errors: Object.values(errors)
                            .reduce((errors, error) => ({
                                ...errors,
                                [error.path]: error.message,
                            }), {}),
                    },
                    DEFAULT_ERROR_CODE
                );
            } else {
                returnResult(ctx, { status, message }, status);
            }
        }
    };
}
