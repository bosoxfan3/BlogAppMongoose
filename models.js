'use strict';

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema(
  {
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {
      firstName: {type:String, required: true},
      lastName: {type:String, required: true}
    },
  }
);

blogPostSchema.virtual('authorName').get(function() { 
  return `${this.author.firstName} ${this.author.lastName}`;
});

blogPostSchema.methods.apiRepr = function() {
  return {
    authorName: this.authorName,
    title: this.title,
    content: this.content
  };
};

const BlogPost = mongoose.model('blogpost', blogPostSchema);

module.exports = { BlogPost };