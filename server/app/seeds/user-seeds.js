import faker from 'faker';
import _ from 'lodash';
import User from '../modules/users';

const COUNT_OF_USERS = 20;

export default function createFakeUsers() {
    const promises = [];
    _.times(COUNT_OF_USERS, () => {
        const userPromise = User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });
        promises.push(userPromise);
    });
    return Promise.all(promises);
}
