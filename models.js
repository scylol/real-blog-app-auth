const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});


blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

//----------------------------------------------------------

const userSchema = mongoose.Schema({
  username: {type:String, required: true, unique:true},
  password: {type: String, required: true},
  firstName: String,
  lastName: String
});

userSchema.methods.apiRepr = function() {
  console.log(this);
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compare(password, this.password)
  .then(isValid => isValid);
};

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);
module.exports = {BlogPost, User};
