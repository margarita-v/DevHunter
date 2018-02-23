import {DEFAULT_ERROR_CODE} from '../constants/status-codes';

/**
 * Function for handling of common errors in application
 */
export default function AppError({ message, errors, name }, status = DEFAULT_ERROR_CODE) {
    // Inherit from the standard JS Error
    Error.call(this);
    Error.captureStackTrace(this);

    this.status = status;
    this.message = message;
    this.errors = errors;
    this.name = name;
}
