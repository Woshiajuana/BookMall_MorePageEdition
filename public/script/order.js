/**
 * Created by 2144 on 2017/3/1.
 */
/*
 导航条部分
 */
var Nav = new Vue({
    el: '#navBar',
    data: {
        is_login: false,
        user_name: '',
        cart_total_goods: 0,
        nav_is_open: false,
        is_about: false
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init();
        });
    },
    methods: {
        //初始化方法
        init: function () {
            this.isLogin();
        },
        //判断用户是否已经登录
        isLogin: function () {
            //获取sessionStorage的用户信息
            var user = sessionStorage.getItem('user');
            //如果不存在，则用户还未登录
            if(!user){
                this.jumpLogin();
                return;
            }
            this.is_login = true;
            user = JSON.parse(user);
            this.user_name = user.user_name;
            //获取用户购物车商品数量
            this.cart_total_goods = this.getGoodForCart();
        },
        //获取用户购物车信息
        getGoodForCart: function () {
            var cart = sessionStorage.getItem('cart');
            return cart ? JSON.parse(cart).length : 0;
        },
        //用户安全退出的方法
        loginOut: function () {
            this.is_login = false;
            this.deleteUserForSessionStorage();
            sessionStorage.clear();
            this.isLogin();
        },
        //删除HTML5本地缓存中的用户信息
        deleteUserForSessionStorage: function () {
            sessionStorage.removeItem('user');
        },
        //是否展开导航条
        openNav: function () {
            this.nav_is_open = !this.nav_is_open;
        },
        //是否打开联系我们
        openAbout: function () {
            this.is_about = !this.is_about;
        },
        //跳转登录页面
        jumpLogin: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/login.html';
        }
    }
});

/*
  购物车部分
 */
var UserOrder = new Vue({
    el: '#user_order',
    data: {
        is_order:false,
        order_arr:[]
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init();
        });
    },
    filters:{
        moneyForRMB: function (num) {
            return "￥" + num.toFixed(2);
        }
    },
    methods: {
        //初始化
        init: function () {
            if(!Nav.$data.is_login) return;
            //获取信息
            this.order_arr = this.getOrderArrForSessionStorage();
            this.is_order = this.order_arr.length ? true : false;
        },
        //获取信息
        getOrderArrForSessionStorage: function () {
            var order_arr = JSON.parse(sessionStorage.getItem('order_arr'));
            return order_arr ? order_arr : [];
        }
    }
});
