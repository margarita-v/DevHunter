import UserService from '../services';

export const TEST_USER_DATA = {
    firstName: 'Ivan',
    lastName: 'Ivanov',
    email: 'email',
    password: 'password',
};

/**
 * Function for creation of user
 */
export async function createTestUser(userData = TEST_USER_DATA) {
    return await UserService.createUser(userData);
}
