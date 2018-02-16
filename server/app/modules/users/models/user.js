import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.plugin(uniqueValidator);

const UserSchema = new Schema({
   email: {
       type: String,
       unique: 'User with email "{VALUE}" already exists',
       lowercase: true,
       required: 'Email is required',
   },
   password: {
       type: String,
       required: 'Password is required',
   },
   firstName: {
       type: String,
       lowercase: true,
       required: 'First name is required',
   },
   lastName: {
       type: String,
       lowercase: true,
       required: 'Last name is required',
   },
}, {
    // Mongoose will automatically add fields createdAt and updatedAt
    timestamps: true,
});

/**
 * Static parameters for a model which will return an array of fields for a user creation
 */
UserSchema.statics.createFields = ['email', 'password', 'firstName', 'lastName'];

/**
 * Function which compares passwords
 */
UserSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Handler for a user creation
 */
UserSchema.pre('save', function(next) {
   if (!this.isModified('password')) {
       return next();
   }

   const salt = bcrypt.genSaltSync(10);
   this.password = bcrypt.hashSync(this.password, salt);
   next();
});

/**
 * Function which returns a user with public fields only.
 */
UserSchema.statics.findOneWithPublicFields = function(params, cb) {
    return this
        .findOne(params, cb)
        .select({
            // 0 because we don't need to get values of that fields
            password: 0,
            _id: 0,
            __v: 0,
        });
};

export default mongoose.model('user', UserSchema);
