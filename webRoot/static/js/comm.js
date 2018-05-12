/**
 * Created by hzj on 2018/5/12 0012.
 */

/**
 * 跳转链接
 * @param url
 * @param self 如果 self有值 跳转新窗口
 */
var $$g = function (url, self) {
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
var $$cookie = {
    /**
     * @param name
     * @param value
     * @param expires 有效期 （秒）
     */
    set: function (name, value, expires) {
        let end = new Date();
        if (expires) {
            end.setTime(end.getTime() + (expires * 1000));
        }
        document.cookie = name + "=" + escape(value) + (expires ? (";expires=" + end.toGMTString()) : "") + ";path=/"; ///*;domain=.baidu.com*/
    },
    get: function (name) {
        let cookie = document.cookie;
        let start = cookie.indexOf(name + "=");
        if (start != -1) {
            start += name.length + 1;
            let end = cookie.indexOf(";", start);
            if (end == -1) {
                end = cookie.length;
            }
            return unescape(cookie.substring(start, end));
        }
        return "";
    }
};

/**
 * 本地localStorage存储
 * @type {{set: Function 存入, get: Function 提取}}
 */
var $$t = {
    set: function (key, value) {
        if (navigator.userAgent.indexOf("MSIE") > 0) { //是否是IE浏览器  ：navigator.userAgent是描述用户代理信息。ie11已经不支持了，ie11不在包含MSIE字段
        } else {
            if (window.localStorage) {
                localStorage[key] = value;
            }
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
var $$api = function (url, param, fun) {
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
                //请求正常
                if (state == '0') {
                    fun(data, 200);
                }
                //请求异常
                else {
                    let error = data.error;
                    if (error != undefined && error != "") {
                        console.log(error);
                        fun(data, parseInt(state));
                    }
                }
            }
        },
        error: function () {
            _loading._hide();
            url = url + ":";
            if (url.indexOf(":51:") > -1 || url.indexOf(":52:") > -1 || url.indexOf(":53:") > -1 || url.indexOf(":54:") > -1 || url.indexOf(":55:") > -1) {
                return;
            }
            console.log("网络错误，请重试");
        }
    });
};

var $$ = {
    // 去除首尾空格
    trim: function (text) {
        if (text) {
            return text.replace(/(^\s*)|(\s*$)/g, "");
        }
    },
    // 计算字节数
    len: function (text) {
        return text.replace(/[^\x00-\xff]/g, "aa").length;
    },
    // 编码
    encode: function (text) {
        return escape(encodeURIComponent(text));
    },
    // 解码
    unencode: function (text) {
        return decodeURIComponent(unescape(text));
    },
    // 显示
    show: function (id) {
        document.getElementById(id).style.display = 'block';
    },
    // 隐藏
    hide: function (id) {
        document.getElementById(id).style.display = 'none';
    },
    //获取文件大小，单位KB
    fileSize: function (id) {
        var fileSize = id.get(0).files[0].size;
        return fileSize / 1024;
    },
    // 不小于0
    zero: function (n) {
        return n < 0 ? 0 : n;
    },
    client: function () {
        return {
            w: document.documentElement.scrollWidth,
            h: document.documentElement.scrollHeight,
            bw: window.outerWidth,
            bh: window.outerHeight
        };
    },
    center: function (id) {
        let top = $$.zero($$.client().bh - document.getElementById(id).offsetHeight / 2);
        let left = $$.zero($$.client().bw - document.getElementById(id).offsetWidth / 2);
        document.getElementById(id).style.top = top;
        document.getElementById(id).style.left = left;
        document.getElementById(id).offsetWidth
    }
};

/*公共弹窗*/
var $$tc = {
    id: "",
    center: function () {
        let top = $$.zero(($$.client().bh - document.getElementById($$tc.id).offsetHeight) / 2);
        let left = $$.zero(($$.client().bw - document.getElementById($$tc.id).offsetWidth) / 2);
        document.getElementById($$tc.id).style.top = top + 'px';
        document.getElementById($$tc.id).style.left = left + 'px';
        document.getElementById($$tc.id).style.zIndex = 3000;
        document.getElementById($$tc.id).style.position = 'fixed';

    },
    show: function (id) {
        $$tc.id = id;
        $$.show(id);
        $$cover.show("cover");
        $$tc.center();
        document.getElementById("cover").addEventListener("click", $$tc.hide);
    },
    hide: function () {
        $$cover.hide("cover");
        $$.hide($$tc.id);
    }
};
// 黑幕
var $$cover = {
    resize: function (id) {
        let width = ($$.client().w > $$.client().bw ? $$.client().w : $$.client().bw) + 'px';
        let height = ($$.client().h > $$.client().bh ? $$.client().h : $$.client().bh) + 'px';
        document.getElementById(id).style.width = width;
        document.getElementById(id).style.height = height;
    },
    show: function (id) {
        $$.show(id);
        document.getElementById(id).style.position = 'fixed';
        document.getElementById(id).style.width = '100%';
        document.getElementById(id).style.height = '100%';
        document.getElementById(id).style.left = 0;
        document.getElementById(id).style.top = 0;
        document.getElementById(id).style.zIndex = '101';
    },
    hide: function (id) {
        $$.hide(id);
    }
};