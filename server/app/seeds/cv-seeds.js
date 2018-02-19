import faker from 'faker';
import { Cv } from '../modules/curriculum-vitae';

const MAX_TAGS_COUNT = 4;

export default function createFakeCv(users) {
    if (!users || !users.length) {
        throw Error('Users are required');
    }
    const promises = [];
    users.forEach((user) => {
        const cvPromise = Cv.create({
            userId: user._id,
            title: faker.name.jobType(),
            description: faker.name.jobArea(),
            phone: faker.phone.phoneNumber(),
            tags: faker.random.words(faker.random.number(MAX_TAGS_COUNT) + 1).split(' '),
        });
        promises.push(cvPromise);
    });
    return Promise.all(promises);
}
