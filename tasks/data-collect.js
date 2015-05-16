"use strict";

var path = require('path'),
	moment = require('moment');

module.exports = function (grunt) {
	grunt.registerTask('data-collect', '4. Collect all data from zdump(8) into a single json file.', function (version) {
		version = version || 'latest';

		var currentYear = new Date().getFullYear();

		var files = grunt.file.expand({ filter : 'isFile', cwd : 'temp/zdump/' + version }, '**/*.zdump'),
			data  = [];

		files.forEach(function (file) {
			var lines   = grunt.file.read(path.join('temp/zdump/' + version, file)).split('\n'),
				abbrs   = [],
				untils  = [],
				offsets = [];

			lines.forEach(function (line, i) {

				// line = Europe/London  Sun Mar 29 01:00:00 2015 UTC = Sun Mar 29 02:00:00 2015 BST isdst=1

				var parts  = line.split(/\s+/); // ["Europe/London", "Sun", "Mar", "29", "01:00:00", "2015", "UTC", "=", "Sun", "Mar", "29", "02:00:00", "2015", "BST", "isdst=1"]

				// Push only current year.
				if (Number(parts[5]) === Number(currentYear)) {

					var format = "MMM D HH:mm:ss YYYY",
						utc    = moment.utc(parts.slice(2, 6).join(' '), format), // "Mar", "29", "01:00:00", "2015"
						local  = moment.utc(parts.slice(9, 13).join(' '), format); // Mar", "29", "02:00:00", "2015"

					if (parts.length < 13) {
						return;
					}

					offsets.push(+utc.diff(local, 'minutes', true).toFixed(4));
					untils.push(+utc);
					abbrs.push(parts[13]);
				}
			});

			// Push only if observe DST.
			if (untils.length > 0) {

				data.push({
					name    : file.replace(/\.zdump$/, ''),
					abbrs   : abbrs,
					untils  : untils,
					offsets : offsets
				});
			}

		});

		grunt.file.mkdir('temp/collect');
		grunt.file.write('temp/collect/' + version + '.json', JSON.stringify(data, null, 2));

		grunt.log.ok('Collected data for ' + version);
	});
};
