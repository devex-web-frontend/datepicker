module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['src/js/**/*.js']
		},
		connect: {
			testserver: {
				options: {
					port: 3000,
					base: '.'
				}
			}
		},
		karma: {
			e2e_dev: {
				configFile: 'karma.e2e.conf.js',
				autoWatch: true,
				browsers: ['Chrome']
			},
			e2e: {
				configFile: 'karma.e2e.conf.js',
				singleRun: true,
				browsers: ['Chrome']
			},
			unit_dev: {
				configFile: 'karma.unit.conf.js',
				autoWatch: true,
				browsers: ['PhantomJS']
			},
			unit: {
				configFile: 'karma.unit.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('build', ['test']);
	grunt.registerTask('test', ['jshint', 'karma:unit', 'connect:testserver', 'karma:e2e']);
	grunt.registerTask('e2e_dev', ['connect:testserver', 'karma:e2e_dev']);
	grunt.registerTask('default', ['build']);
};