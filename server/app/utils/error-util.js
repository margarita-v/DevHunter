const DEFAULT_ERROR_CODE = 400;

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
        throwError(ctx, errorCode, errorMessage);
    }
}

export {
    throwError,
    checkCondition,
};
