const mongoose = require('mongoose');
const db = require('../connection');

const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
  },

  issue_text: {
    type: String,
    required: true,
  },

  created_on: {
    type: Date,
    default: new Date().toISOString(),
  },

  updated_on: {
    type: Date,
    default: new Date().toISOString(),
  },

  created_by: {
    type: String,
    required: true,
  },

  assigned_to: {
    type: String,
    default: '',
  },

  open: {
    type: Boolean,
    default: true,
  },

  status_text: {
    type: String,
    default: '',
  },

  project: {
    type: String,
  },
});

module.exports = db.model('Issue', issueSchema);
