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
	   prompting: function () {  //接受用户输入
        var done = this.async(); //当处理完用户输入需要进入下一个生命周期阶段时必须调用这个方法

        //yeoman-generator 模块提供了很多内置的方法供我们调用，如下面的this.log , this.prompt , this.template , this.spawncommand 等

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the server-admin ' + chalk.red('example') + ' generator!'
        ));
        this.name = path.basename(process.cwd());
        this.license = 'ISC';
        this.description = '';
        this.author = '';
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'name of app:', default: this.name
            },
            {
                type: 'input',
                name: 'description',
                message: 'description:', default: this.description
            },
            {
                type: 'input',
                name: 'license',
                message: 'license:', default: this.license
            },
            {
                type: 'input',
                name: 'author',
                message: 'author:', default: this.author
            }

        ];
        this.prompt(prompts, function (props) {
            this.name = props.name;
            this.pkgName = props.name;
            this.license = props.license;
            this.author = props.author;
            this.description = props.description;

            done();  //进入下一个生命周期阶段
        }.bind(this));
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