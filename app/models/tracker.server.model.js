'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tracker Schema
 */
var TrackerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tracker name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tracker', TrackerSchema);