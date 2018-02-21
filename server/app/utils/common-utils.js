import {DEFAULT_ERROR_CODE, OK_STATUS_CODE} from './status-codes';

/**
 * Function for throwing error with given params
 */
function throwError(ctx, errorMessage, errorCode = DEFAULT_ERROR_CODE) {
    ctx.throw(errorCode, { message: errorMessage });
}

/**
 * Function which checks a condition and throws error if condition is true
 */
function checkCondition(ctx, condition, errorMessage, errorCode = DEFAULT_ERROR_CODE) {
    if (condition) {
        throwError(ctx, errorMessage, errorCode);
    }
}

/**
 * Function which returns result with its status code to user
 */
function returnResult(ctx, result, statusCode = OK_STATUS_CODE) {
    ctx.body = result;
    ctx.status = statusCode;
}

/**
 * Function which returns a result data with its status code to user
 */
function returnData(ctx, data, statusCode = OK_STATUS_CODE) {
    returnResult(ctx, { data: data }, statusCode);
}

export {
    throwError,
    checkCondition,
    returnResult,
    returnData,
};
