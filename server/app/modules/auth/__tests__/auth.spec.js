import {User} from '../../users'
import {createTestUser} from "../../users/helpers/user-helpers";
import {expectProperties} from "../../../helpers/test-helpers";
import {closeAndDropDb, initAndDropDb} from "../../../utils/mongo-utils";

describe('Auth controller test', () => {

    beforeAll(async () => await initAndDropDb());

    it('User signed up successfully', async () => {
        const user = await createTestUser();
        const userObject = user.toObject();

        expectProperties(userObject, ['_id', 'hash', 'createdAt', 'updatedAt']);
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
