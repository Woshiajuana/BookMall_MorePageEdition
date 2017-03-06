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
var Address = new Vue({
    el: '#address',
    data: {
        address_arr: [],
        total_price: 0,
        goods_arr: [],
        is_open_popup: false,
        address_id:'',
        address_user_name:'',
        address_tel: '',
        address_name: '',
        is_address_default:false,
        popup_msg:'',
        address_active_index:0
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
            this.address_arr = this.getAddressForSessionStorage();
            this.getGoodsForSessionStorage();
            var _this = this;
            this.address_arr.forEach(function (item,index) {
                if(item.is_address_default)
                    _this.address_active_index = index;
            });
        },
        //获取地址信息
        getAddressForSessionStorage: function () {
            var address = JSON.parse(sessionStorage.getItem('address'));
            return address ? address : [];
        },
        //获取商品以及总价格
        getGoodsForSessionStorage: function () {
            var banGoods = JSON.parse(sessionStorage.getItem('banGoods'));
            this.total_price = banGoods.total_price;
            this.goods_arr = banGoods.goods;
        },
        addAddressConfirm: function () {//013074
            this.is_open_popup = true;
        },
        //添加收货地址
        addAddress: function () {
            if(this.checkNull()) return;
            var address = {};
            address.address_id = this.address_id || Date.parse(new Date());
            address.address_tel = this.address_tel;
            address.address_name = this.address_name;
            address.address_user_name = this.address_user_name;
            address.is_address_default = this.address_id ? this.is_address_default : false;
            if(this.address_id){
                var _this = this;
                this.address_arr.forEach(function (item,index) {
                    if(item.address_id == _this.address_id){
                        item.address_user_name = address.address_user_name;
                        item.address_tel = address.address_tel;
                        item.address_name = address.address_name;
                        item.is_address_default = address.is_address_default;
                    }
                });
            }else{
                this.address_arr.push(address);
            }
            this.keepAddressForSessionStorge();
            this.is_open_popup = false;
            this.address_id = '';
            this.address_user_name = '';
            this.address_tel = '';
            this.is_address_default = false;
            this.address_name = '';
            this.popup_msg = '';
        },
        //选择哪个收货地址
        selectAddress: function (index) {
            this.address_active_index = index;
        },
        //检测是否为空
        checkNull: function () {
            if(this.address_name && this.address_tel && this.address_user_name){
                this.popup_msg = '';
                return false;
            }else{
                this.popup_msg = '请填写收货信息';
                return true;
            }
        },
        //设置为默认地址
        setDefaultAddress: function (address,e) {
            e.stopPropagation();
            this.address_arr.forEach(function (item, index) {
                if(item.address_id == address.address_id)
                    item.is_address_default = true;
                else
                    item.is_address_default = false;
            });
            this.keepAddressForSessionStorge();
        },
        //关闭弹窗
        closePopup: function () {
            this.is_open_popup = false;
            this.address_id = '';
            this.address_user_name = '';
            this.address_name = '';
            this.address_tel = '';
            this.is_address_default = false;
        },
        //修改
        updateAddressConfirm: function (address) {
            this.is_open_popup = true;
            this.address_id = address.address_id;
            this.address_user_name = address.address_user_name;
            this.address_name = address.address_name;
            this.address_tel = address.address_tel;
            this.is_address_default = address.is_address_default;
        },
        //下一步
        nextStep: function () {
            var address = "",
                _this = this;
            this.address_arr.forEach(function (item, index) {
                if(index == _this.address_active_index)
                    address = item;
            });
            if(address){
                this.createOrder(address);
                this.jumpSuccess();
            }
        },
        //返回
        getOrderArrForSessionStorge: function () {
            var order_arr = JSON.parse(sessionStorage.getItem('order_arr'));
            return order_arr ? order_arr : [];
        },
        //生成一个订单
        createOrder: function (address) {
            var str = '',
                order_arr = this.getOrderArrForSessionStorge(),
                len = this.goods_arr.length;
            this.goods_arr.forEach(function (item, index) {
                if(index == 0)
                    str += '《' + item.name + '》 、 《';
                else if(index == len-1)
                    str += item.name + '》';
                else{
                    str += item.name + '》 、 《';
                }
            });
            var order={
                id:Date.parse(new Date()),
                goods:str,
                price:this.total_price,
                time:new Date().toLocaleString(),
                user_name:address.address_user_name,
                user_tel:address.address_tel,
                user_address:address.address_name
            };
            order_arr.push(order);
            sessionStorage.setItem('order_arr',JSON.stringify(order_arr));
            sessionStorage.setItem('order',JSON.stringify(order));
        },
        //跳转到完成页面
        jumpSuccess: function () {
            var pathname = window.location.pathname,
                pathname = pathname.substr(0,pathname.lastIndexOf('/'));
            window.location.href = window.location.origin + pathname + '/success.html';
        },
        //保存地址到session中
        keepAddressForSessionStorge: function () {
            sessionStorage.setItem('address',JSON.stringify(this.address_arr));
        }
    }
});
