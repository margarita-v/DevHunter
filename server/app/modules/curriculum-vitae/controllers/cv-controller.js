import pick from 'lodash/pick';
import Cv from '../models';

/**
 * Controller for CV creation
 */
export default {
    async create(ctx) {
        const { _id } = await Cv.create({
            ...pick(ctx.request.body, Cv.createFields),
            userId: ctx.user._id,
        });
        const cv = await Cv.findOne({ _id });
        ctx.body = { data: cv };
    },
};
