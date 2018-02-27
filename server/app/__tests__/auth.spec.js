import {expectProperties} from '../helpers/test-helpers';
import {dropDb} from '../utils/mongo-utils';
import {TEST_USER_DATA} from '../modules/users/helpers/user-helpers';
import {User} from '../modules/users';
import request from 'supertest';
import server from '../server';
import {
    CREATED_STATUS_CODE,
    DEFAULT_ERROR_CODE,
    NOT_FOUND_ERROR_CODE,
    OK_STATUS_CODE,
} from '../constants/status-codes';

const requestServer = request(server);

describe('Auth test', () => {
    const SIGN_UP_ROUTE = '/api/auth/signup';
    const SIGN_IN_ROUTE = '/api/auth/signin';

    const { email, password } = TEST_USER_DATA;

    describe('Sign up test', () => {
        it('User signed up successfully',
            (done) => signUp().expect(CREATED_STATUS_CODE, done));

        it('Test sign up for an invalid data',
            (done) => postAndCheck(SIGN_UP_ROUTE, {}, DEFAULT_ERROR_CODE, (res) => {
                expectProperties(res.body.errors, User.createFields);
                done();
            })
        );

        afterAll(async () => await dropDb());
    });

    describe('Sign in test', () => {
        it('User signed in successfully', async (done) => {
            await signUp();
            postAndCheck(SIGN_IN_ROUTE, { email, password }, OK_STATUS_CODE, (res) => {
                expect(res.body).toHaveProperty('data');
                done();
            });
        });

        it('Test for sign in for an invalid data',
            (done) => signIn({}, DEFAULT_ERROR_CODE, done));

        it('Try to sign in with an invalid password', async (done) => {
            await signUp();
            signIn({ email, password: 'invalid-password' }, DEFAULT_ERROR_CODE, done);
        });

        it('Try to sign in with unknown email',
            (done) => signIn({email: 'another-email', password}, NOT_FOUND_ERROR_CODE, done));

        afterAll(async () => await dropDb());
    });

    afterAll(() => server.close());

    function signUp() {
        return postData(SIGN_UP_ROUTE, TEST_USER_DATA);
    }

    function signIn(data, responseCode, done) {
        return postData(SIGN_IN_ROUTE, data).expect(responseCode, done);
    }

    function postAndCheck(route, data, responseCode, end) {
        return postData(route, data)
            .expect(responseCode)
            .end((err, res) => end(res));
    }
});

function postData(route, data) {
    return requestServer.post(route).send(data);
}
