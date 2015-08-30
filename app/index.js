'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var jsfs = require('fs');

/**
 * Maxxton Microservice generator
 * ==============================
 * Version: 1.0
 * Author: R. Sonke (r.sonke@maxxton.com)
 * 
 * ==============================
 * 
 */


var createAppName = function(str)
{
  str = str.replace(new RegExp('-|_', 'g'), ' ');
  
  var partsOfStr = str.split(' ');
  var result = '';
  partsOfStr.forEach(function(word) {
    result += word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  
  return result;
}

module.exports = yeoman.generators.Base.extend({

  constructor: function (args, options, config) 
  {
    yeoman.generators.Base.apply(this, arguments);

    // greet the user
    this.log(
      chalk.red('Maxxton Microservice generator\n\n') +
      yosay() + '\n\n' +
      '==============================\n' +
      'Version: 1.0\n' +
      'Author: R. Sonke (r.sonke@maxxton.com)\n\n' +
      'Author: R. Hermans (r.hermans@maxxton.com)\n\n' +
      '==============================\n\n' +
      'Lets get started with some questions!\n\n' 
    );

    this.log(chalk.magenta('Generating service structure'));
  },

  prompting: function () {
    var done = this.async();

    var maxPrompts = 9;

    var prompts = 
    [
      {
        type: 'string',
        name: 'baseName',
        message: '(1/'+maxPrompts+') What is the base name of this microservice?',
        default: 'awesome-service'
      },
      {
        type: 'string',
        name: 'packageName',
        message: '(2/'+maxPrompts+') What is your default package?',
        default: 'com.maxxton.awesome'
      },
      {
        type: 'string',
        name: 'userName',
        message: '(3/'+maxPrompts+') What is your name?',
        default: 'M. Axxton',
        store: true
      },
      {
        type: 'string',
        name: 'userEmail',
        message: '(4/'+maxPrompts+') What is your email?',
        default: 'm.axxton@maxxton.com',
        store: true
      },
      {
        type: 'list',
        name: 'serviceType',
        message: '(5/'+maxPrompts+') Select the kind of service you need.',
        choices: [
          {
            name: 'Basic (empty application which uses only default options)',
            value: 'basic'
          },
          {
            name: 'High level service (A business logic service with a rest interface)',
            value: 'high'
          },
          {
            name: 'Low level service (A backend service talking to datasources and never gets called by a user directly)',
            value: 'low'
          }
        ]
      },
      {
        type: 'string',
        name: 'configUri',
        message: '(6/'+maxPrompts+') Provide the uri for the Spring Config Server.',
        default: 'http://localhost:8888',
        store: true
      },
      {
        type: 'confirm',
        name: 'configFail',
        message: '(7/'+maxPrompts+') Should the service fail fast when not being able to connect to the Spring Config Server?',
        default: true,
        store: true
      },
      {
        type: 'confirm',
        name: 'needDocker',
        message: '(8/'+maxPrompts+') Shall I generate a default Dockerfile?',
        default: 'Y',
        store: true
      },
      {
        type: 'confirm',
        name: 'needSwagger',
        message: '(9/'+maxPrompts+') Shall I generate the configuration and dependencies to use Swagger for Rest api documentation?',
        default: 'Y'
      },
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      
      // composed ones
      this.props.author = this.props.userName + ' (' + this.props.userEmail + ')';
      this.props.currentYear = (new Date()).getFullYear();
      this.props.applicationName = createAppName(this.props.baseName);
      this.props.mainClassName = this.props.applicationName + 'Application';

      this.props.isBasic = this.props.serviceType === 'basic';
      this.props.isHigh = this.props.serviceType === 'high';
      this.props.isLow = this.props.serviceType === 'low';

      done();
    }.bind(this));
  },
  writing: {
    app: function () {

      var packageFolder = this.props.packageName.replace(/\./g, '/');
      var srcDir = 'src/main/java/' + packageFolder;
      var testDir = 'src/test/java/' + packageFolder;

      var deps = "";
      if(this.props.isLow){
        deps = jsfs.readFileSync(this.sourceRoot() + '/low.gradle','utf8');
      }else if(this.props.isHigh){
        deps = jsfs.readFileSync(this.sourceRoot() + '/high.gradle','utf8');
      }

      this.variables = {
        author: this.props.author,
        currentYear: this.props.currentYear,
        serviceType: this.props.serviceType,
        mainClassName: this.props.mainClassName,
        applicationName: this.props.applicationName,
        userEmail: this.props.userEmail,
        userName: this.props.userName,
        packageName: this.props.packageName,
        baseName: this.props.baseName,
        configUri: this.props.configUri,
        configFail: this.props.configFail,
        extraDependencies: deps,
        swaggerEnabled: this.props.needSwagger
      };

      // write all files now, with or without template functionality
      this.fs.copyTpl(
        this.templatePath('build.gradle'),
        this.destinationPath('build.gradle'),
        this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('gradle.properties'),
        this.destinationPath('gradle.properties')
      );

      if(this.props.needDocker) {
        this.fs.copyTpl(
          this.templatePath('Dockerfile'),
          this.destinationPath('src/main/docker/Dockerfile'),
          this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
        );
      };

      this.fs.copyTpl(
        this.templatePath('logback.xml'),
        this.destinationPath('src/main/resources/logback.xml'),
        this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('banner.txt'),
        this.destinationPath('src/main/resources/banner.txt'),
        this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('application.yml'),
        this.destinationPath('src/main/resources/application.yml'),
        this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('bootstrap.yml'),
        this.destinationPath('src/main/resources/bootstrap.yml'),
        this.variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );
      
      this.fs.copyTpl(
        this.templatePath('MaxxtonApplication.java'),
        this.destinationPath(srcDir + '/'+ this.props.mainClassName +'.java'),
        this.variables
      );

      this.fs.copyTpl(
        this.templatePath('ApplicationProfile.java'),
        this.destinationPath(srcDir + '/config/ApplicationProfile.java'),
        this.variables
      );

      this.fs.copyTpl(
        this.templatePath('DevelopmentPropertySourceLocator.java'),
        this.destinationPath(srcDir + '/config/DevelopmentPropertySourceLocator.java'),
        this.variables
      );

      this.fs.copyTpl(
        this.templatePath('MaxxtonApplicationTest.java'),
        this.destinationPath(testDir + '/'+ this.props.mainClassName +'Test.java'),
        this.variables
      );

      if(this.props.needSwagger) {
        this.fs.copyTpl(
          this.templatePath('SwaggerConfig.java'),
          this.destinationPath(srcDir + '/config/SwaggerConfig.java'),
          this.variables
        );
        this.fs.copyTpl(
          this.templatePath('SwaggerController.java'),
          this.destinationPath(srcDir + '/rest/SwaggerController.java'),
          this.variables
        );
      }

    },
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }
  },
  install: function () {
    
  },
  end: function () {
    this.log(chalk.green('Basic service completed!\n'));

    // Call depending generators
    this.composeWith("microservice:eureka", {options: {vars: this.variables}}).on('end', function(){
      this.composeWith("microservice:rxjava", {options: {vars: this.variables}});
    });
  }
});





