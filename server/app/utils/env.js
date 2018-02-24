import envs from '../constants/envs';

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === envs.development;
const IS_TEST = ENV === envs.test;

export default ENV;

export {
    IS_DEV,
    IS_TEST,
};
