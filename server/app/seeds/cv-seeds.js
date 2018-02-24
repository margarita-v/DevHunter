import faker from 'faker';
import { Cv } from '../modules/curriculum-vitae';

const MAX_TAGS_COUNT = 4;

export default function createFakeCv(users) {
    if (!users || !users.length) {
        throw Error('Users are required');
    }
    const promises = [];
    users.forEach((user) => {
        const cvPromise = Cv.create(createFakeCvData(user.hash));
        promises.push(cvPromise);
    });
    return Promise.all(promises);
}

/**
 * Function for getting object with generated fields for CV creation
 */
function createFakeCvData(userHash) {
    return {
        userHash,
        title: faker.name.jobType(),
        description: faker.name.jobArea(),
        phone: faker.phone.phoneNumber(),
        tags: faker.random.words(faker.random.number(MAX_TAGS_COUNT) + 1).split(' '),
    };
}

/**
 * Function for getting a list of random objects for creation of CV list
 */
export function createFakeCvDataList(count) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(createFakeCvData(`hash${i}`));
    }
    return result;
}
