import {User} from '../index'
import {createTestUser} from "../helpers/user-helpers";
import {COMMON_REQUIRED_FIELDS, expectProperties} from "../../../helpers/test-helpers";
import {closeAndDropDb, initAndDropDb} from "../../../utils/mongo-utils";

describe('User service test', () => {

    beforeAll(async () => await initAndDropDb());

    it('User was created successfully', async () => {
        const user = await createTestUser();
        const userObject = user.toObject();

        expectProperties(userObject, COMMON_REQUIRED_FIELDS);
        await user.remove();
    });

    it('Invalid data for a user creation', async () => {
        try {
            await createTestUser({});
        } catch (err) {
            expectProperties(err.errors, User.createFields);
        }
    });

    afterAll(async () => await closeAndDropDb());
});
