import User from '../models';

/**
 * Service with common functions for users
 */
export default {

    /**
     * Function for creation of user
     * @returns {data} Promise for user's creation
     */
    createUser(data) {
        return User.create(data);
    },

    /**
     * Function for getting a user with public fields only
     */
    getUserWithPublicFields(params) {
        return User
            .findOne(params)
            .select({
                // 0 because we don't need to get values of that fields
                password: 0,
                _id: 0,
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
            });
    },
};
