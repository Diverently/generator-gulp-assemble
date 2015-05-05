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

// General stuff
Generator.prototype.siteScaffold = function siteScaffold() {
  this.template('site/robots.txt', 'src/robots.txt');
  this.template('site/.htaccess', 'src/.htaccess');

  this.mkdir('src/assets/favicons');
  this.mkdir('src/assets/fonts');
};

// Assemble Scaffold
Generator.prototype.assembleScaffold = function assembleScaffold() {
  this.fs.copyTpl(
    this.templatePath('site/layouts/default.hbs'),
    this.destinationPath('src/layouts/default.hbs'),
    { sitename: this.sitename }
  );
  this.template('site/pages/index.hbs', 'src/pages/index.hbs');
  this.template('site/pages/books.hbs', 'src/pages/books.hbs');
  this.template('site/partials/site-navigation.hbs', 'src/partials/site-navigation.hbs');
  this.fs.copyTpl(
    this.templatePath('site/data/data.yml'),
    this.destinationPath('src/data/data.yml'),
    { sitename: this.sitename }
  );
  this.template('site/data/books.json', 'src/data/books.json');
};

// CSS Scaffold
Generator.prototype.cssScaffold = function cssScaffold() {
  var pathFrom = 'site/assets/css/',
      pathTo   = 'src/assets/css/';

  this.fs.copyTpl(
    this.templatePath(pathFrom + 'main.scss'),
    this.destinationPath(pathTo + 'main.scss'),
    { sitename: this.sitename }
  );
  this.template(pathFrom + '_settings.scss', pathTo + '_settings.scss');
  this.template(pathFrom + 'modules/_site-navigation.scss', pathTo + 'modules/_site-navigation.scss');
  this.template(pathFrom + 'core/_mixins.scss', pathTo + 'core/_mixins.scss');
};

// JavaScript Scaffold
Generator.prototype.jsScaffold = function jsScaffold() {
  var pathFrom = 'site/assets/js/',
      pathTo   = 'src/assets/js/';

  this.template(pathFrom + 'main.coffee', pathTo + 'main.coffee');
  this.template(pathFrom + 'modules/log.coffee', pathTo + 'modules/log.coffee');
  this.template(pathFrom + 'standalone/html5shiv-printshiv.js', pathTo + 'standalone/html5shiv-printshiv.js');
  this.template(pathFrom + 'vendor/picturefill.js', pathTo + 'vendor/picturefill.js');
};

// Tool Files
Generator.prototype.packageFiles = function packageFiles() {
  this.template('root/_package.json', 'package.json');
  this.fs.copyTpl(
    this.templatePath('root/_bower.json'),
    this.destinationPath('bower.json'),
    { sitename: this.sitename }
  );
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
