import mongoose, { Schema } from 'mongoose';
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.plugin(uniqueValidator);

const UserSchema = new Schema({
   email: {
       trim: true,
       type: String,
       unique: 'User with email "{VALUE}" already exists',
       lowercase: true,
       required: 'Email is required',
   },
   password: {
       trim: true,
       type: String,
       required: 'Password is required',
   },
   firstName: {
       trim: true,
       type: String,
       lowercase: true,
       required: 'First name is required',
   },
   lastName: {
       trim: true,
       type: String,
       lowercase: true,
       required: 'Last name is required',
   },
   hash: {
      type: String,
       unique: 'Hash must be unique',
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
UserSchema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Handler for a user creation
 */
UserSchema.pre('save', function(next) {
   if (this.isModified('password')) {
       const salt = bcrypt.genSaltSync(10);
       this.password = bcrypt.hashSync(this.password, salt);
   }

   if (!this.hash) {
       this.hash = uuid();
   }

   next();
});

export default mongoose.model('user', UserSchema);
