'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


/**
 * Maxxton Microservice generator
 * ==============================
 * Version: 1.0
 * Author: R. Sonke (r.sonke@maxxton.com)
 * 
 * ==============================
 * 
 * TODO:
 * - application flavors
 * - subgenerators for services, controllers, repositories
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

  prompting: function () {
    var done = this.async();

    // greet the user
    this.log(
      chalk.red('Maxxton Microservice generator\n\n') +
      yosay() + '\n\n' +
      '==============================\n' +
      'Version: 1.0\n' +
      'Author: R. Sonke (r.sonke@maxxton.com)\n\n' +
      '==============================\n\n' +
      'Lets get started with some questions!\n\n' 
    );

    var maxPrompts = 7;

    var prompts = [{
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
      type: 'confirm',
      name: 'needDocker',
      message: '(6/'+maxPrompts+') Shall I generate a default Dockerfile?',
      default: 'Y'
    },
    {
      type: 'checkbox',
      name: 'examples',
      message: '(7/'+maxPrompts+') Do you want to generate example classes?',
      choices: [
        {
          name: 'RxJava example',
          value: 'rxjava'
        },
        {
          name: 'Eureka example',
          value: 'eureka'
        },
      ]
    },
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      
      // composed ones
      this.props.author = this.props.userName + ' (' + this.props.userEmail + ')';
      this.props.currentYear = (new Date()).getFullYear();
      this.props.mainClassName = createAppName(this.props.baseName) + 'Application';

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

      var variables = {
        author: this.props.author,
        currentYear: this.props.currentYear,
        serviceType: this.props.serviceType,
        mainClassName: this.props.mainClassName,
        userEmail: this.props.userEmail,
        userName: this.props.userName,
        packageName: this.props.packageName,
        baseName: this.props.baseName
      };

      // write all files now, with or without template functionality
      this.fs.copyTpl(
        this.templatePath('build.gradle'),
        this.destinationPath('build.gradle'),
        variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      if(this.props.examples.length > 0){
        this.props.examples.forEach(function(example){
          this.fs.copyTpl(
            this.templatePath('examples/' + example + 'Example.java'),
            this.destinationPath(srcDir + '/examples/' +  example + 'Example.java'),
            variables,
            { 'interpolate': /<%=([\s\S]+?)%>/g }
          );
        }, this);
      }

      if(this.props.needDocker) {
        this.fs.copyTpl(
          this.templatePath('Dockerfile'),
          this.destinationPath('src/main/docker/Dockerfile'),
          variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
        );
      }

      this.fs.copyTpl(
        this.templatePath('logback.xml'),
        this.destinationPath('src/main/resources/logback.xml'),
        variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('banner.txt'),
        this.destinationPath('src/main/resources/banner.txt'),
        variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('application.yml'),
        this.destinationPath('src/main/resources/application.yml'),
        variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );

      this.fs.copyTpl(
        this.templatePath('bootstrap.yml'),
        this.destinationPath('src/main/resources/bootstrap.yml'),
        variables,
        { 'interpolate': /<%=([\s\S]+?)%>/g }
      );
      
      this.fs.copyTpl(
        this.templatePath('MaxxtonApplication.java'),
        this.destinationPath(srcDir + '/'+ this.props.mainClassName +'.java'),
        variables
      );

      this.fs.copyTpl(
        this.templatePath('ApplicationProfile.java'),
        this.destinationPath(srcDir + '/config/ApplicationProfile.java'),
        variables
      );

      this.fs.copyTpl(
        this.templatePath('MaxxtonApplicationTest.java'),
        this.destinationPath(testDir + '/'+ this.props.mainClassName +'Test.java'),
        variables
      );



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
    this.log('All done, happy coding!');
  }
});





