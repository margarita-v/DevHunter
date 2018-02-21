import Cv from '../models';

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
        const { userId } = data;
        const cvCount = await Cv.count({ userId });
        if (cvCount === MAX_CV_COUNT) {
            throw new AppError({ message: `User can not create over ${MAX_CV_COUNT} CVs` });
        }
        return Cv.create(data);
    },

    /**
     * Function for updating of CV
     */
    async updateCv(data, cv) {
        cv.set(data);
        return cv.save();
    },
};
