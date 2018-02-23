import Cv from '../models';
import AppError from '../../../helpers/error';

/**
 * Max count of CVs for the one user
 */
const MAX_CV_COUNT = 3;

/**
 * Service with common functions for CVs
 */
export default {

    /**
     * Function for creation of CV
     */
    async createCv(data) {
        // For getting a count of the current user's CVs
        const { userHash } = data;
        const cvCount = await Cv.count({ userHash });
        if (cvCount === MAX_CV_COUNT) {
            throw new AppError({ message: `User can not create over ${MAX_CV_COUNT} CVs` });
        }
        return Cv.create(data);
    },

    /**
     * Function for updating of CV
     */
    updateCv(data, cv) {
        cv.set(data);
        try {
            return cv.save();
        } catch (err) {
            throw new AppError({ ...err });
        }
    },

    /**
     * Function for searching of CVs
     */
    async search({ title, tags, size, page }) {
        const query = {
            title: {
                $regex: title,
            },
        };
        const sortObject = { updatedAt: '-1' };

        if (tags.length) {
            query.tags = { $in: tags };
        }

        // Count of all CVs for the current query
        const cvCount = await Cv
            .count(query)
            .sort(sortObject);
        const pagesCount = Math.ceil(cvCount / size);

        if (page > pagesCount) {
            page = pagesCount;
        }

        // List of response items
        const cvList = await Cv
            .find(query)
            .sort(sortObject)
            // Count of items which will be get from the database
            .limit(size)
            .skip((page - 1) * size);

        return { cvList, cvCount, pagesCount, page };
    },
};
