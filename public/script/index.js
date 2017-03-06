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
            if(!user) return;
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
            BookController.seeAddedCartForGoods();
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
        }
    }
});
/*
  轮播图部分
 */
var Carousel = new Vue({
    el: '#carousel-example-generic',
    data: {
        active_index: 0,
        carouselArr: []
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init();
        });
    },
    methods: {
        //初始化
        init: function () {
            this.getCarouselData();
        },
        //获取数据
        getCarouselData: function () {
            this.$http.get('../data/index/carousel.json').then(function (res) {
                var data = res.body;
                if(data.status != 1) return;
                this.carouselArr = data.result;
                this.autoCarousel();
            });
        },
        //按钮切换
        switchCarouselByBtn: function (num) {
            if(this.temp) clearInterval(this.temp);
            this.active_index += num;
            this.switchCarousel();
            this.autoCarousel();
        },
        //切换轮播图
        switchCarousel: function () {
            if(this.active_index < 0) this.active_index = this.carouselArr.length -1;
            if(this.active_index >= this.carouselArr.length) this.active_index = 0;
        },
        //索引切换
        switchCarouselByTrigger: function (index) {
            if(this.temp) clearInterval(this.temp);
            this.active_index = index;
            this.autoCarousel();
        },
        //自动切换
        autoCarousel: function () {
            var _this = this;
            this.temp = setInterval(function () {
                _this.switchCarouselByBtn(1);
            },4000)
        }
    }
});
/*
 图书部分
 */
var BookController = new Vue({
    el: '#container',
    data: {
        bookArr: []
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
            this.getCarouselData();
        },
        //获取数据
        getCarouselData: function () {
            this.$http.get('../data/index/book.json').then(function (res) {
                var data = res.body;
                if(data.status != 1) return;
                this.bookArr = data.result;
                this.seeAddedCartForGoods();
            });
        },
        //查看哪些商品已添加到了购物车
        seeAddedCartForGoods: function () {
            var _this = this,
                cart_goods_arr = this.getSessionStorage();
            this.bookArr.forEach(function (item, index) {
                item.books.forEach(function (book, ind) {
                    _this.$set(book,'is_add',false);
                    if(cart_goods_arr.length == 0) return;
                    cart_goods_arr.forEach(function (it, i) {
                        if(it.book_id == book.book_id)
                            _this.$set(book,'is_add',true);
                    });
                })
            });
        },
        //加入购物车
        addCart: function (book){
            //首先判断用户是否登录
            if(!Nav.$data.is_login)
                this.jumpLogin();
            else{
                book.is_add = true;
                this.keepBookForCart(book);
            }
        },
        //从购物车移除
        removeCart: function (book) {
            book.is_add = false;
            var cart = this.getSessionStorage();
            cart.forEach(function (item, index) {
                if(item.book_id == book.book_id){
                    cart.splice(index,1);
                    return;
                }
            });
            sessionStorage.setItem('cart',JSON.stringify(cart));
            //改变商品数量
            if(Nav.$data.cart_total_goods > 0) Nav.$data.cart_total_goods--;
        },
        //存储数据到购物车
        keepBookForCart: function (book) {
            //首先获取session本地缓存里的购物车信息
            var cart = this.getSessionStorage();
            cart.push(book);
            sessionStorage.setItem('cart',JSON.stringify(cart));
            //改变商品数量
            Nav.$data.cart_total_goods++;
        },
        //获取session本地缓存里的购物车信息
        getSessionStorage: function () {
            var cart = sessionStorage.getItem('cart');
            return cart ? JSON.parse(sessionStorage.getItem('cart')) : [];
        },
        //跳转登录页面
        jumpLogin: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/login.html';
        }
    }
});