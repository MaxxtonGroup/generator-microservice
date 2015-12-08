'use strict'
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yaml = require('js-yaml');
var yamlfs = require('fs');

/**
 * Maxxton Eureka generator
 * ========================
 * Version: 1.0
 * Author: R. Hermans (r.hermans@maxxton.com)
 * Author: C. Vaes (c.vaes@maxxton.com)
 * Author: R. Wolffensperger (r.wolffensperger@maxxton.com)
 *
 * ========================
 */

module.exports = yeoman.generators.Base.extend({

	constructor: function (args, options, config){
		yeoman.generators.Base.apply(this, arguments);
		this.vars = this.options.vars;
    this.log(chalk.magenta('Configurating Eureka client'));
	},

	askHostname : function(){
		if(this.props.connectionType === 'hostname'){
			var done = this.async();

			var prompts = [
				{
					name: 'hostname',
					type: 'string',
					message: '(Extra) Please provide a hostname',
					default: 'localhost',
        	store: true
				},
			]

			this.prompt(prompts, function (props){
				this.props.hostname = props.hostname;
				done();
			}.bind(this));
		}
	},

	prompting: function(){
		var done = this.async();

		var maxPrompts = 1;

		var prompts = [
    	{
    		name: 'genExample',
    		type: 'confirm',
    		message: '(1/'+maxPrompts+') Would you like to generate a usage example of the Eureka client?',
    		default: false,
    	}

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

    	//Insert eureka example class
    	if(this.props.genExample){
        this.fs.copyTpl(
          this.templatePath('EurekaExample.java'),
          this.destinationPath(srcDir + '/examples/EurekaExample.java'),
          this.vars,
          { 'interpolate': /<%=([\s\S]+?)%>/g }
        );
      }

    }
  },

  install: function () {},
  end: function (){
    this.log(chalk.green('Eureka configuration completed!\n'));
  },
});
