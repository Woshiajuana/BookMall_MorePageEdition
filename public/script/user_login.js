/**
 * Created by 2144 on 2017/3/2.
 */

/*
 导航条部分
 */
var Nav = new Vue({
    el: '#navBar',
    data: {
        nav_is_open: false
    },
    methods: {
        //是否展开导航条
        openNav: function () {
            this.nav_is_open = !this.nav_is_open;
        }
    }
});
/*
    用户登录
 */
var UserLogin = new Vue({
    el: "#user-login",
    data: {
        loginMsg: '',
        user_name: '',
        user_password: '',
        isRemUser: false
    },
    mounted: function () {  //入口
        //保证在调用方法的时候，确认vue已操控该DOM
        this.$nextTick(function () {
            //初始化
            this.init();
        })
    },
    methods: {
        //初始化
        init: function () {
            //首先判断用户是否已经登录
            this.isLogin();
            //然后判断用户是否在本地存储了登录信息
            this.isKeepUserForLocalStorage();
        },
        //判断用户是否已经登录
        isLogin: function () {
            //获取sessionStorage的用户信息
            var user = sessionStorage.getItem('user');
            //如果不存在，则用户还未登录
            if(!user) return;
            //如果用户存在，则返回网站首页
            this.jumpHome();
        },
        //判断用户是否存储信息
        isKeepUserForLocalStorage: function () {
            //获取localStorage的用户信息
            var user = localStorage.getItem('user');
            if(!user) return;
            user = JSON.parse(user);
            this.user_name = user.user_name;
            this.user_password = user.user_password;
            this.isRemUser = true;
        },
        //登录方法
        loginIn: function () {
            //检查用户信息是否填写完整
            if(this.checkNull())
                return;
            //后台验证用户是否合法
            this.reqUserLogin();
        },
        //检查信息是否为空的方法
        checkNull: function () {
            if(!this.user_name || !this.user_password){
                this.loginMsg = '请填写完整登录信息';
                return true;
            }
            return false;
        },
        //把用户填写的登录信息传给后台验证
        reqUserLogin: function () {
            //因为还没有做后台所以我是直接做的假数据
            //this.$http.get('../data/login/user.json').then(function (res) {
            //});
            //验证LocalStorage的用户信息
            var _this = this,
                user_arr = this.getUserForLocalStorage();
            user_arr.push({
                user_name: 'woshiajuana',
                user_password: '123456',
                email: '979703986@qq.com'
            });
            user_arr.forEach(function (item, index) {
                if(item.user_name == _this.user_name && item.user_password == _this.user_password){
                    //保存用户信息到SessionStorage
                    _this.keepUserForSessionStorage(item);
                    //判断用户是否选择了记住我，保存用户信息到LocalStorage
                    if(_this.isRemUser)
                        _this.keepUserForLocalStorage(item);
                    else
                        _this.deleteUserForLocalStorage();
                    //跳转到首页面
                    _this.jumpHome();
                    return;
                }
            });
            setTimeout(function () {
                _this.loginMsg = '用户名或密码不正确';
            },1000)
        },
        //存取用户信息到HTML5本地缓存中
        keepUserForSessionStorage: function (user) {
            if(!user) return;
            user = JSON.stringify(user);
            sessionStorage.setItem('user',user);
        },
        //存取用户信息到HTML5本地缓存中
        keepUserForLocalStorage: function (user) {
            if(!user) return;
            user.isRemUser = this.isRemUser;
            user = JSON.stringify(user);
            localStorage.setItem('user',user);
        },
        //获取用户信息从HTML5本地缓存中
        getUserForLocalStorage: function () {
            var user_arr = localStorage.getItem('user_arr');
            return user_arr ? JSON.parse(user_arr) : [];
        },
        //删除HTML5本地缓存中的用户信息
        deleteUserForLocalStorage: function () {
            localStorage.removeItem('user');
        },
        //跳转首页
        jumpHome: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/index.html';
        },
        //记住用户信息
        remUser: function () {
            this.isRemUser = !this.isRemUser;
        }
    }
});