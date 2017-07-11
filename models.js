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
  return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogPostSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    content: this.content,
    authorName: this.authorName,
    id: this.id
  };
};

const BlogPost = mongoose.model('blogpost', blogPostSchema);

module.exports = { BlogPost };