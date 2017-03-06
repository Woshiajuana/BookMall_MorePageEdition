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
var Cart = new Vue({
    el: '#cart',
    data: {
        cart_goods_arr: [],
        is_have_goods: false,
        total_price: 0,
        is_all_select: false,
        is_open_popup: false,
        popup_prompt: '',
        is_show_btn: true,
        need_delete_book: ''
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
            this.cart_goods_arr = this.iterationGoods(function (item, index) {
                item.number = 1;
                item.is_active = false;
            });
            this.is_have_goods = this.cart_goods_arr.length ? true : false;
        },
        //遍历商品信息添加属性
        iterationGoods: function (callback) {
            var cart_goods = this.cart_goods_arr.length ? this.cart_goods_arr : this.getSessionStorage();
            cart_goods.forEach(function (item, index) {
                callback(item,index);
            });
            return cart_goods;
        },
        //全选商品
        selectAllGoods: function () {
            var _this = this;
            this.is_all_select = !this.is_all_select;
            this.iterationGoods(function (item, index) {
                item.is_active = _this.is_all_select;
            });
            this.countPriceGoods();
        },
        //是否确定删除
        deleteGoodsConfirm: function (book) {
            this.is_open_popup = true;
            this.popup_prompt = '确定从购物车中移出该商品吗？';
            this.is_show_btn = true;
            this.need_delete_book = book;
        },
        //删除该商品从购物车中
        deleteGoodsForCart: function () {
            var book = this.need_delete_book,
                index = '';
            this.cart_goods_arr.forEach(function (item, ind) {
                if(item == book){
                    index = ind;
                    return;
                }
            });
            this.cart_goods_arr.splice(index,1);
            this.is_have_goods = this.cart_goods_arr.length ? true : false;
            var cart = this.getSessionStorage();
            cart.forEach(function (item, index) {
                if(item.book_id == book.book_id){
                    cart.splice(index,1);
                    return;
                }
            });
            this.is_open_popup = false;
            sessionStorage.setItem('cart',JSON.stringify(cart));
            if(Nav.$data.cart_total_goods > 0) Nav.$data.cart_total_goods--;
        },
        //计算价格
        countPriceGoods: function () {
            var _this = this;
            this.total_price = 0;
            this.iterationGoods(function (item, index) {
                if(item.is_active)
                    _this.total_price += item.number * item.price;
            });
        },
        //结算商品
        balanceGoods: function () {
            var _this = this,
                selectGoods = [];
            this.cart_goods_arr.forEach(function (item, index) {
                if(item.is_active)
                    selectGoods.push(item);
            });
            if(!selectGoods.length){
                this.is_open_popup = true;
                this.popup_prompt = '亲！别忘了请选择商品结算哦~~~';
                this.is_show_btn = false;
                return;
            }
            this.keepBalanceGoodsForSessionStorage(selectGoods);
            //跳转到地址选择页面
            this.jumpAddress();
        },
        //把结算的商品存储到session中
        keepBalanceGoodsForSessionStorage: function (goods) {
            var banGoods = {
                total_price: this.total_price,
                goods: goods
            };
            sessionStorage.setItem('banGoods',JSON.stringify(banGoods));
        },
        //选中商品
        selectGoods: function (book) {
            book.is_active = !book.is_active;
            this.countPriceGoods();
        },
        //修改商品数量
        updateGoodsNum: function (book,num) {
            var number = book.number;
            number += num;
            if(number <= 0 ) number = 1;
            book.number = number;
            this.countPriceGoods();
        },
        //获取session本地缓存里的购物车信息
        getSessionStorage: function () {
            var cart = sessionStorage.getItem('cart');
            return cart ? JSON.parse(sessionStorage.getItem('cart')) : [];
        },
        //跳转地址选择页面
        jumpAddress: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/address.html';
        }
    }
});
