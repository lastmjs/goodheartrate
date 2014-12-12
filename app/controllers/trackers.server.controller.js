'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tracker = mongoose.model('Tracker'),
	_ = require('lodash'),
	User = mongoose.model('User');
	
/**
* Create a Tracker
*/
exports.createOrUpdate = function(req, res) {	
	var trackerReceived = new Tracker(req.body);
	trackerReceived.user = req.user;
	
	var setUserStartBPM = function(count) {
		if(count <= 7) {
			Tracker.find({}, function(err, trackers) {
				if (err) {
					return; //TODO what should I do for this error?
				}
				
				var totalBPM = 0;
				for(var i=0; i < trackers.length; i++) {
					totalBPM += trackers[i].bpm;
				}
				
				var startingBPM = totalBPM / trackers.length;
				
				User.findOne({_id: req.user._id}, function(err, user) {
					user.startingHeartRate = startingBPM;
					
					user.save(function(err) {
						if(err) {
							return; //TODO what do I do with this error?
						}
					});
				});
				
				/*var userModel = new User(req.user);
				var userObj = userModel.toObject();
				
				userModel.startingHeartRate = startingBPM;
				userModel.save(function(err) {
					if(err) {
						return; //TODO what to do for this error?
					}
				});*/
			});
		}
	};	
	
	Tracker.findOne({date: trackerReceived.date}).exec(function(err, tracker) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		if(tracker) {
			tracker.bpm = trackerReceived.bpm;
			
			tracker.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(tracker);
					
					Tracker.count({}, function(err, count) {
						if(err) {
							return; //TODO what kind of error should be thrown here?
						}
						
						setUserStartBPM(count);
					});
				}
			});
		} else {
			trackerReceived.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(trackerReceived);
					
					Tracker.count({}, function(err, count) {
						if(err) {
							return; //TODO what kind of error should be thrown here?
						}
						
						setUserStartBPM(count);
					});
				}
			});
		}
	});	
};

/**
* Get list of Trackers
*/
exports.list = function(req, res) {
	Tracker.find({user: req.user}).sort('date').exec(function(err, trackers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		res.jsonp(trackers);
	});
};

exports.getByDate = function(req, res) {
	Tracker.findOne({date: req.params.date, user: req.user}).exec(function(err, tracker) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		if(tracker) {
			tracker = tracker.toObject();
			tracker.date = tracker.date.getFullYear().toString() + '-' +  (tracker.date.getMonth() + 1).toString() + '-' + tracker.date.getUTCDate().toString();
		}
		
		res.jsonp(tracker);
	});
};

/**
 * Create a Tracker with username provided in URL
 */
/*exports.create = function(req, res) {	
	var tracker = new Tracker(req.body);
	
	User.findOne({'username': req.params.username}, function(err, user) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		tracker.user = user;
		
		console.log(tracker);
		
		tracker.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tracker);
			}
		});	
	});
};*/

/**
 * Show the current Tracker
 */
exports.read = function(req, res) {
	res.jsonp(req.tracker);
};

/**
 * Update a Tracker
 */
exports.update = function(req, res) {
	var tracker = req.tracker ;

	tracker = _.extend(tracker , req.body);

	tracker.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tracker);
		}
	});
};

/**
 * Delete an Tracker
 */
exports.delete = function(req, res) {
	var tracker = req.tracker ;

	tracker.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tracker);
		}
	});
};

/**
 * Tracker middleware
 */
exports.trackerByID = function(req, res, next, id) { 
	Tracker.findById(id).populate('user', 'displayName').exec(function(err, tracker) {
		if (err) return next(err);
		if (! tracker) return next(new Error('Failed to load Tracker ' + id));
		req.tracker = tracker ;
		next();
	});
};

/**
 * Tracker authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tracker.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
