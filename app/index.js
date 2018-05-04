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
	   writing: {  //生成目录结构阶段
        app: function () {      //默认源目录就是生成器的templates目录，目标目录就是执行`yo example`时所处的目录。调用this.template用Underscore模板语法去填充模板文件
            this.directory('config', 'config');    //拷贝目录
			this.directory('public', 'public');
			this.directory('scripts', 'scripts');
			this.directory('src', 'src');
			this.copy('package.json', 'package.json');   //拷贝文件
			this.copy('.env', '.env');
			this.copy('.eslintrc', '.eslintrc');
			this.copy('.gitignore', '.gitignore');
        }
    },

    install: function () {
        var done = this.async();
        this.spawnCommand('cnpm', ['install'])  //安装项目依赖
            .on('exit', function (code) {
                if (code) {
                    done(new Error('code:' + code));
                } else {
                    done();
                }
            })
            .on('error', done);
    },
    end: function() {
        this.log(yosay(
            'Your app has been created successfully!'
        ));
    }
});
module.exports = Reactpackage;