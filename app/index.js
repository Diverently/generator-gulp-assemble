'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var s = require('underscore.string');

var Generator = module.exports = function Generator(args, options) {

  // Take an optional argument for the site name
  yeoman.generators.Base.apply(this, arguments);
  this.argument('sitename', { type: String, required: false });
  this.sitename = this.sitename || path.basename(process.cwd());
  this.sitename = s.humanize(this.sitename);

  // Install dependencies after creating the site
  this.on('end', function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  });

  this.pkg = require('../package.json');
  this.sourceRoot(path.join(__dirname, '../templates'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.log(yosay());
    this.log(
      chalk.magenta(
        'I will provide you with a Gulp and Assemble setup.' +
        '\n'
      )
    );
  }
};

// Generator.prototype.askForRepository = function askForRepository() {
//   var cb = this.async();
//
//   this.prompt([{
//     type: 'confirm',
//     name: 'repoExists',
//     message: 'Do you have a GitHub repo for this site?',
//     default: false
//   }, {
//     type: 'input',
//     name: 'repoName',
//     message: 'What is it called?',
//     when: function (props) {
//       return props.repoExists;
//     }
//   }], function (props) {
//     this.repoExists = props.repoExists;
//     this.repoName = props.repoName;
//   }.bind(this));
// };

Generator.prototype.siteScaffold = function siteScaffold() {
  this.template('site/robots.txt', 'src/robots.txt');
  this.template('site/.htaccess', 'src/.htaccess');
  // Assemble
  this.fs.copyTpl(
    this.templatePath('site/layouts/default.hbs'),
    this.destinationPath('src/layouts/default.hbs'),
    { sitename: this.sitename }
  );
  this.template('site/pages/index.hbs', 'src/pages/index.hbs');
  this.template('site/pages/books.hbs', 'src/pages/books.hbs');
  this.template('site/partials/site-navigation.hbs', 'src/partials/site-navigation.hbs');
  this.template('site/data/data.yml', 'src/data/data.yml');
  this.template('site/data/books.json', 'src/data/books.json');
  // Assets
  this.fs.copyTpl(
    this.templatePath('site/assets/css/main.scss'),
    this.destinationPath('src/assets/css/main.scss'),
    { sitename: this.sitename }
  );
  this.template('site/assets/css/_settings.scss', 'src/assets/css/_settings.scss');
  this.template('site/assets/css/modules/_site-navigation.scss', 'src/assets/css/modules/_site-navigation.scss');
  this.template('site/assets/css/core/_mixins.scss', 'src/assets/css/core/_mixins.scss');
  this.mkdir('src/assets/favicons');
  this.mkdir('src/assets/fonts');
  this.mkdir('src/assets/js');
};

Generator.prototype.packageFiles = function packageFiles() {
  this.template('root/_package.json', 'package.json');
  this.template('root/_gulpfile.js', 'gulpfile.js');
  this.fs.copyTpl(
    this.templatePath('root/README.md'),
    this.destinationPath('README.md'),
    { sitename: this.sitename }
  );
  this.template('root/.editorconfig', '.editorconfig');
  this.template('root/gitignore', '.gitignore');
  this.template('root/.gitattributes', '.gitattributes');
  this.template('root/.jshintrc', '.jshintrc');
};
