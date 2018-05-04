var path = require('path');
var chalk = require('chalk');    //不同颜色的info
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');    //yeoman弹出框
var path = require('path');
var Reactpackage = yeoman.Base.extend({
    info: function() {
        this.log(chalk.green(
            'I am going to build your app!'
        ));
    },
    generateBasic: function() {  //按照自己的templates目录自定义
        this.directory('config', 'config');    //拷贝目录
        this.directory('public', 'public');
		this.directory('scripts', 'scripts');
		this.directory('src', 'src');
        this.copy('package.json', 'package.json');   //拷贝文件
        this.copy('.env', '.env');
        this.copy('.eslintrc', '.eslintrc');
        this.copy('.gitignore', '.gitignore');
    },
    install: function() {      //安装依赖
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    },
    end: function() {
        this.log(yosay(
            'Your app has been created successfully!'
        ));
    }
});
module.exports = Reactpackage;