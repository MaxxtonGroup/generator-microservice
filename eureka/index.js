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

		var maxPrompts = 2;

		var prompts = [
    	{
    		name: 'genExample',
    		type: 'confirm',
    		message: '(1/'+maxPrompts+') Would you like to generate a usage example of the Eureka client?',
    		default: false,
    	},
    	{
    		name: 'connectionType',
    		type: 'list',
    		message: '(2/'+maxPrompts+') How would you like your service to be known at the Eureka server?',
    		choices: [
         	{
         		name: 'Reference by Hostname',
         		value: 'hostname'
         	},
         	{
         		name: 'Reference by IP address',
         		value: 'ipaddress'
         	}
         ]
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

      // Update current application.yml to insert eureka configuration.
      try{
        var config = yaml.safeLoad(yamlfs.readFileSync('src/main/resources/application.yml', 'utf8'));

        if(this.props.connectionType === 'hostname'){
          config.eureka = {instance: {hostname: this.props.hostname } };
        }else if (this.props.connectionType == 'ipaddress'){
          config.eureka = {instance: {preferIpAddress: true} };
        }

        yamlfs.writeFileSync('src/main/resources/application.yml', yaml.safeDump(config));
      }catch (e){
        this.log(chalk.red('Failed to update "application.yml" for the Eureka dependency!'));
        this.log(e);
      }
    }
  },

  install: function () {},
  end: function (){
    this.log(chalk.green('Eureka configuration completed!\n'));
  },
});