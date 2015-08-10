'use strict'
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

/**
 * Maxxton RxJava generator
 * ========================
 * Version: 1.0
 * Author: R. Hermans (r.hermans@maxxton.com)
 *
 * ========================
 */

module.exports = yeoman.generators.Base.extend({

	constructor: function (args, options, config) {
		yeoman.generators.Base.apply(this, arguments);
		this.vars = this.options.vars;
    this.log(chalk.magenta('Configurating RxJava'));
	},

	prompting: function(){
		var done = this.async();

		var maxPrompts = 1;

		var prompts = [
    	{
    		name: 'genExample',
    		type: 'confirm',
    		message: '(1/'+maxPrompts+') Would you like to generate a usage example of Reactive Java?',
    		default: false
    	},
		];

		this.prompt(prompts, function (props){
			this.props = props;
			done();
		}.bind(this));
	},

  writing:{
    app: function (){
    	var packageFolder = this.vars.packageName.replace(/\./g, '/');
    	var srcDir = 'src/main/java/' + packageFolder;

    	//Insert rxjava example class
    	if(this.props.genExample){
        this.fs.copyTpl(
          this.templatePath('RxJavaExample.java'),
          this.destinationPath(srcDir + '/examples/RxJavaExample.java'),
          this.vars,
          { 'interpolate': /<%=([\s\S]+?)%>/g }
        );
      }
    }
  },

  install: function () {},
  end: function () {
    this.log(chalk.green('RxJava configuration completed!\n'));
  },
});