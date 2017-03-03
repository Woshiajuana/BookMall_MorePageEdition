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
    用户注册
 */
var UserRegister = new Vue({
    el: "#user-register",
    data: {
        register_msg: '',
        user_name: '',
        user_password: '',
        user_password_too: '',
        user_email: '',
        is_agree: true
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
        //注册方法
        registerIn: function () {
            //检查用户信息是否填写完整
            if(this.checkNull())
                return;
            //后台验证用户是否合法
            this.reqUserRegister();
        },
        //重置方法
        resetInput: function () {
            this.register_msg = '';
            this.user_name = '';
            this.user_password = '';
            this.user_password_too = '';
            this.user_email = '';
            this.is_agree = true
        },
        //检查信息是否为空的方法
        checkNull: function () {
            if(!this.user_name || !this.user_password
                || !this.user_password_too || !this.user_email){
                this.register_msg = '请填写完整登录信息';
                return true;
            }
            if(this.user_password_too != this.user_password){
                this.register_msg = '两次密码不一致';
                return true;
            }
            if(!this.is_agree){
                this.register_msg = '您未同意协议';
                return true;
            }
            return false;
        },
        //把用户填写的登录信息传给后台验证
        reqUserRegister: function () {
            if(this.checkRepeatUser()) return;
            //因为还没有做后台所以我是直接做的假数据直接存储到location中
            var user = {
                user_name: this.user_name,
                user_password: this.user_password,
                user_email: this.user_email
            };
            this.keepUserForLocalStorage(user);
            //注册成功跳转到登录页面
            this.jumpLogin();
        },
        //存取用户信息到HTML5本地缓存中
        keepUserForLocalStorage: function (user) {
            if(!user) return;
            var user_arr = this.getUserForLocalStorage();
            user_arr.push(user);
            localStorage.setItem('user_arr',JSON.stringify(user_arr));
        },
        //获取用户信息从HTML5本地缓存中
        getUserForLocalStorage: function () {
            var user_arr = localStorage.getItem('user_arr');
            return user_arr ? JSON.parse(user_arr) : [];
        },
        //验证用户名是否重复
        checkRepeatUser: function () {
            var _this = this,
                type = false,
                user_arr = this.getUserForLocalStorage();
            user_arr.forEach(function (item,index) {
                if(item.user_name == _this.user_name){
                    this.register_msg = '用户名已存在';
                    type = true;
                }
            });
            if (this.user_name == 'woshiajuana'){
                this.register_msg = '用户名已存在';
                type = true;
            }
            return type;
        },
        //是否同意服务协议
        agreementUser: function () {
            this.is_agree = !this.is_agree;
        },
        //跳转登录页面
        jumpLogin: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/login.html';
        }
    }
});