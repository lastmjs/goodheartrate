'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	}
});

mongoose.model('User', UserSchema);