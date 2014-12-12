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
	bpm: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tracker', TrackerSchema);