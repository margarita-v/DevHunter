export default () => async(ctx, next) => {
    try {
        await next();
    } catch({ status = 500, message = 'Server error', name, errors}) {
        // Mongoose validation error
        if (name === 'ValidationError') {
            ctx.status = 400;
            ctx.body = {
                errors: Object.values(errors)
                    .reduce((errors, error) => ({
                        ...errors,
                        [error.path]: error.message
                    }), {})
            };
        } else {
            ctx.status = status;
            ctx.body = { status, message };
        }
    }
};