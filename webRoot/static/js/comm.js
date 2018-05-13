/***
 * Created by hzj on 2018/5/12 0012...
 */

var $_$, $_$user, $_$g, $_$cookie, $_$t, $_$api, $_$tc, $_$cover, $_$loading, $_$toast;

/**
 * 基础设置
 */
$_$ = {
    // 去除首尾空格
    trim: function (text) {
        return !text ? '' : text.replace(/(^\s*)|(\s*$)/g, '');
    },
    // 计算字符数
    len: function (text) {
        return !text ? 0 : text.replace(/[^\x00-\xff]/g, "aa").length;
    },
    // 编码
    encode: function (text) {
        return !text ? '' : escape(encodeURIComponent(text));
    },
    // 解码
    unencode: function (text) {
        return !text ? '' : decodeURIComponent(unescape(text));
    },
    // 显示(#id)
    isShow: function (id) {
        if (id) {
            document.getElementById(id).style.display = 'block';
        }
    },
    // 隐藏(#id)
    isHide: function (id) {
        if (id) {
            document.getElementById(id).style.display = 'none';
        }
    },
    // 获取文件大小，单位KB
    fileSize: function (id) {
        return !id ? 0 : id.get(0).files[0].size / 1024;
    },
    // 不小于0的数
    zero: function (n) {
        return !n ? 0 : (n < 0 ? 0 : n);
    }
};

/**
 * 设备分析
 * inWx: Function, 微信
 * inQq: Function, QQ
 * inWb: Function, 微博
 * inMb: Function, 移动端
 * inIos: Function,
 * inAndroid: Function
 * inIE: Function 是否ie
 * inIElow: Function(v) 是否小等于某ie版本
 */
$_$user = {
    inWx: function () {
        return navigator.userAgent.match(/micromessenger/i) != null;
    },
    inQq: function () {
        return /(iPad|iPhone|iPod).*?QQ/g.test(navigator.userAgent) || /\bV1_AND_SQ_/.test(navigator.userAgent);
    },
    inWb: function () {
        return navigator.userAgent.match(/weibo/i) != null;
    },
    inMb: function () {
        return navigator.userAgent.match(/AppleWebKit.*Mobile.*/) != null;
    },
    inIos: function () {
        return navigator.userAgent.match(/ipad|iphone|ipod/i) != null;
    },
    inAndroid: function () {
        return navigator.userAgent.match(/android/i) != null;
    },
    inIE: function () {
        return navigator.userAgent.toLowerCase().indexOf("msie") > -1;
    },
    inIElow: function (version) {
        if (!version || isNaN(version)) {
            return false;
        }
        return $_$user.inIE() && navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1] >= version;
    }
};

/**
 * 跳转链接
 * @param url
 * @param self (可选) 跳转新窗口
 */
$_$g = function (url, self) {
    if (self && self != '') {
        window.open(url);
    } else {
        location.href = url;
    }
};

/**
 * cookie操作
 * @type {{set: Function 存入, get: Function 提取}}
 */
$_$cookie = {
    /**
     * @param name
     * @param value
     * @param expires 有效期 （秒）
     */
    set: function (name, value, expires) {
        let thisEnd = new Date();
        if (expires) {
            thisEnd.setTime(thisEnd.getTime() + (expires * 1000));
        }
        document.cookie = name + "=" + escape(value) + (expires ? (";expires=" + thisEnd.toGMTString()) : "") + ";path=/";
    },
    get: function (name) {
        let cookie = document.cookie;
        let start = cookie.indexOf(name + "=");
        if (start != -1) {
            start += name.length + 1;
            let thisEnd = cookie.indexOf(";", start);
            if (thisEnd == -1) {
                thisEnd = cookie.length;
            }
            return unescape(cookie.substring(start, thisEnd));
        }
        return "";
    }
};

/**
 * 本地localStorage存储
 * @type {{set: Function 存入, get: Function 提取}}
 */
$_$t = {
    set: function (key, value) {
        if (!$_$user.inIE() && window.localStorage) {
            localStorage[key] = value;
        }
    },
    get: function (key) {
        return window.localStorage ? (localStorage[key] || "") : "";
    }
};

/**
 * 公共的异步
 * @param url
 * @param param
 * @param fun
 */
$_$api = function (url, param, fun) {
    var $;
    $.ajax({
        type: "post",
        url: url,
        data: param,
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        success: function (data) {
            if (data != null) {
                let state = data.state;
                // 请求异常
                if (state != '0') {
                    let error = data.error;
                    if (error != undefined) {
                        if (error != "") {
                            $_$toast.isShow(error);
                            fun(data, parseInt(state));
                        }
                    }
                    // 请求正常
                } else {
                    fun(data, 200);
                }
            }
        },
        error: function (data) {
            $_$loading.isHide();
            if (data) {
                $_$toast.isShow(data);
            }
        }
    });
};

/**
 * 公共弹窗
 * @type {{id: string, center: Function, isShow: Function, isHide: Function}}
 */
$_$tc = {
    id: "",
    center: function () {
        let top = (($_$user.inIElow(8) ? document.documentElement.clientHeight : window.innerHeight) - document.getElementById($_$tc.id).offsetHeight) / 2;
        let left = (($_$user.inIElow(8) ? document.documentElement.clientWidth : window.innerWidth) - document.getElementById($_$tc.id).offsetWidth) / 2;
        let tc = document.getElementById($_$tc.id);
        tc.style.top = $_$.zero(top) + 'px';
        tc.style.left = $_$.zero(left) + 'px';
        tc.style.zIndex = 3000;
        tc.style.position = 'fixed';
    },
    isShow: function (id) {
        $_$tc.id = id;
        $_$.isShow(id);
        $_$tc.center();
        $_$cover.isShow('0.5');
        if ($_$user.inIElow(8)) {
            window.attachEvent('onresize', $_$tc.center);
        } else {
            window.addEventListener('resize', $_$tc.center, false);
        }
    },
    isHide: function () {
        $_$cover.isHide();
        $_$.isHide($_$tc.id);
        if ($_$user.inIElow(8)) {
            window.detachEvent('onresize', $_$tc.center);
        } else {
            window.removeEventListener('resize', $_$tc.center, false);
        }
    }
};

/**
 * 黑幕
 * @type {{resize: Function, isShow: Function, isHide: Function}}
 */
$_$cover = {
    isShow: function (opacity) {
        let cover = document.createElement('div');
        cover.setAttribute('id', 'cover');
        cover.style.position = 'fixed';
        cover.style.width = '100%';
        cover.style.height = '100%';
        cover.style.left = 0;
        cover.style.top = 0;
        cover.style.zIndex = '101';
        if ($_$user.inIElow(8)) {
            cover.style.background = 'rgb(0, 0, 0)';
            cover.style.filter = 'Alpha(opacity=' + opacity * 100 + ')';
        } else {
            cover.style.background = 'rgba(0, 0, 0, ' + opacity + ')';
        }
        // 做为弹窗黑幕时设置点击关闭事件
        if (opacity == '0.5') {
            if ($_$user.inIElow(8)) {
                cover.attachEvent('onclick', $_$tc.isHide);
            } else {
                cover.addEventListener('click', $_$tc.isHide, false);
            }
        }
        let body = document.getElementsByTagName('body');
        body[0].appendChild(cover);
    },
    isHide: function () {
        let cover = document.getElementById('cover');
        if (cover) {
            cover.parentNode.removeChild(cover);
        }
        if ($_$user.inIElow(8)) {
            window.detachEvent('onclick', $_$tc.isHide);
        } else {
            window.removeEventListener('click', $_$tc.isHide, false);
        }
    }
};

/**
 * loading 数据加载中公共弹窗
 * @type {{center: Function, isShow: Function, isHide: Function}}
 */
$_$loading = {
    center: function () {
        let left = $_$user.inIElow(8) ? document.documentElement.clientWidth : window.innerWidth;
        let top = $_$user.inIElow(8) ? document.documentElement.clientHeight : window.innerHeight;
        let div = document.getElementById('loadingDiv');
        div.style.position = 'fixed';
        div.style.zIndex = '3001';
        div.style.width = '120px';
        div.style.height = '120px';
        div.style.left = (left / 2 - 60) + 'px';
        div.style.top = (top / 2 - 60) + 'px';
        if ($_$user.inIElow(8)) {
            div.style.background = 'rgb(0, 0, 0)';
            div.style.filter = 'Alpha(opacity=50)';
        } else {
            div.style.background = 'rgba(0, 0, 0, .5)';
            div.style.borderRadius = '8px';
        }
    },
    isShow: function (text) {
        let div = document.createElement('div');
        div.setAttribute('id', 'loadingDiv');
        div.innerHTML = '<p style="padding:30px 0 20px;text-align:center;"><img src="../../static/images/loading2.gif" style="width:30px;height:30px"></p><p style="text-align:center;font-size:12px;color:#fff;padding:0">' + text + '</p>';
        let body = document.getElementsByTagName('body');
        body[0].appendChild(div);
        if ($_$user.inIElow(8)) {
            window.attachEvent('onresize', $_$loading.center);
        } else {
            window.addEventListener('resize', $_$loading.center, false);
        }
        $_$cover.isShow(0);
        $_$loading.center();
    },
    isHide: function () {
        $_$cover.isHide();
        let div = document.getElementById('loadingDiv');
        if (div) {
            div.parentNode.removeChild(div);
        }
        if ($_$user.inIElow(8)) {
            window.detachEvent('onresize', $_$loading.center);
        } else {
            window.removeEventListener('resize', $_$loading.center, false);
        }
    }
};

$_$toast = {
    center: function () {
        let div = document.getElementById('toast');
        div.style.bottom = '100px';
        div.style.position = 'fixed';
        div.style.zIndex = '3001';
        if ($_$user.inIElow(8)) {
            div.style.background = 'rgb(0,0,0)';
        } else {
            div.style.background = 'rgba(0,0,0,.8)';
        }
        div.style.borderRadius = '5px';
        div.style.fontSize = '16px';
        div.style.color = '#fff';
        div.style.lineHeight = '20px';
        div.style.textAlign = 'center';
        div.style.padding = '9px 15px';
        let left = (($_$user.inIElow(8) ? document.documentElement.clientWidth : window.innerWidth) - div.offsetWidth) / 2;
        div.style.left = $_$.zero(left) + "px";
    },
    isShow: function (text, fun) {
        let div = document.createElement('div');
        div.setAttribute('id', 'toast');
        div.innerHTML = text;
        let body = document.getElementsByTagName('body');
        body[0].appendChild(div);
        $_$toast.center();
        if ($_$user.inIElow(8)) {
            window.attachEvent('onresize', $_$toast.center);
        } else {
            window.addEventListener('resize', $_$toast.center, false);
        }
        setTimeout(function () {
            $_$toast.isHide(fun);
        }, 3000);
    },
    isHide: function (fun) {
        let div = document.getElementById('toast');
        div && div.parentNode.removeChild(div);
        if ($_$user.inIElow(8)) {
            window.detachEvent('onresize', $_$toast.center);
        } else {
            window.removeEventListener('resize', $_$toast.center, false);
        }
        fun && fun();
    }
};

/**
 * 获取url中某参数值
 * @param name
 * @param url 可选
 * @returns {string}
 */
function getUrlStr(name, url) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let _url;
    if (url) {
        if (url.indexOf('?') > 0) {
            _url = url.substr(url.indexOf('?') + 1);
        } else {
            _url = url;
        }
    } else {
        _url = window.location.search.substr(1)
    }
    let r = _url.match(reg);  //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
        context = r[2].replace(/eval/g, '')
            .replace(/\\,/g, '')
            .replace(/\./g, '')
            .replace(/\\;/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\//g, '')
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/"/g, '')
            .replace(/&lt;/g, '')
            .replace(/&gt;/g, '')
            .replace(/&quot;/g, '')
            .replace(/&amp;/g, '');
    reg = null;
    r = null;
    return context == null || context == '' || !context ? '' : context;
}

window.onload = function () {
    $_$.trim();
    $_$.len();
    $_$.encode();
    $_$.unencode();
    $_$.fileSize();
    $_$user.inAndroid();
    $_$user.inIE();
    $_$user.inIElow(9);
    $_$user.inIos();
    $_$user.inMb();
    $_$user.inQq();
    $_$user.inWb();
    $_$user.inWx();
    $_$cookie.set('', '');
};