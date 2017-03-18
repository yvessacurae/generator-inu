'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({

	initializing: function() {
		this.log(yosay('Welcome to Inu generator! Before start you will need answer some questions.'));
	},

	prompting: function () {
		var prompts = [{
			type    : 'input',
			name    : 'author',
			message : 'First, what is your name?',
			default : 'Unknow'
		},
		
		{
			type    : 'input',
			name    : 'name',
			message : 'What is your project name?',
			default : this.appname // Default to current folder name
		},

		{
			type    : 'input',
			name    : 'git',
			message : 'What is the git url?',
			default : ''
		},

		{
			type: 'checkbox',
			name: 'features',
			message: 'Which features would you like to work?',
			choices: [{
				name: 'jQuery',
				value: 'includeJQuery',
				checked: false
			}, {
				name: 'Bootstrap',
				value: 'includeBootstrap',
				checked: false
			}]
		}];
		
		return this.prompt(prompts).then(function (answers) {
			this.git = answers.git;
			this.name = answers.name;
			this.author = answers.author;
			var features = answers.features;

			function hasFeature(feat) {
				return features && features.indexOf(feat) !== -1;
			}
			
			this.includeJQuery = hasFeature('includeJQuery');
			this.includeBootstrap = hasFeature('includeBootstrap');
		}.bind(this))
	},

	writing: {
		installJQuery: function () {
			if(this.includeJQeury) {
				this.npmInstall(['jquery'], { 'save-dev': true });
			}
		},

		installBootstrap: function () {
			if(this.includeBootstrap) {
				this.npmInstall(['bootstrap'], { 'save-dev': true });
			}
		},

		packageJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				{ 
					git: this.git,
					name: this.name,
					author: this.author
				}
			);
		},
		
		gulpfile: function () {
			this.fs.copyTpl(
				this.templatePath('_gulpfile.js'),
				this.destinationPath('gulpfile.js'),
				{ name: this.name }
			);
		},
		
		styles: function () {
			this.fs.copyTpl(
				this.templatePath('_styles.scss'),
				this.destinationPath('src/scss/styles.scss')
			);

			this.fs.copyTpl(
				this.templatePath('_styles.css'),
				this.destinationPath('dist/css/styles.css')
			);
		},

		scripts: function () {
			this.fs.copyTpl(
				this.templatePath('_main.js'),
				this.destinationPath('src/js/main.js')
			);

			this.fs.copyTpl(
				this.templatePath('_scripts.js'),
				this.destinationPath('dist/js/scripts.js')
			);
		},

		views: function () {
			this.fs.copyTpl(
				this.templatePath('_index.pug'),
				this.destinationPath('src/views/index.pug'),
				{ name: this.name }
			);
		},
		
		readme: function () {
			this.fs.copyTpl(
				this.templatePath('_README.txt'),
				this.destinationPath('README.txt'),
				{ name: this.name }
			);
		},
		
		gitignore: function () {
			this.fs.copyTpl(
				this.templatePath('_.gitignore'),
				this.destinationPath('.gitignore')
			);
		}
	},

	install:function () {
		this.installDependencies();
	}
})