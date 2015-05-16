"use strict";

var helpers = require("../../helpers/helpers");

exports["Africa/El_Aaiun"] = {
	"2015" : helpers.makeTestYear("Africa/El_Aaiun", [
		["2015-06-13T01:59:59+00:00", "02:59:59", "WEST", -60],
		["2015-06-13T02:00:00+00:00", "02:00:00", "WET", 0],
		["2015-07-18T01:59:59+00:00", "01:59:59", "WET", 0],
		["2015-07-18T02:00:00+00:00", "03:00:00", "WEST", -60]
	])
};