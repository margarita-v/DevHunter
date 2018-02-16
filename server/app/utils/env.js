import envs from '../constants/envs';

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === envs.development;

export default ENV;

export {
    IS_DEV,
};
