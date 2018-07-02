/**
 * 数组 -- reduce()
 * 迭代数组的所有数组项，返回一个最终值
 **/

array.reduce(callbackfn, [initialValue]);
// reduce()方法接收一个函数 callbackfn 作为累加器，数组中的每个值（从左到右）开始合并。

function callbackfn(preValue, curValue, index, array) {
}
/** reduce() 方法接收 callbackfn 函数，而这个函数包含四个参数：
 * preValue： 上一次调用回调返回的值，或者是提供的初始值 initialValue
 * curValue： 数组中当前被处理的数组项
 * index： 当前数组项在数组中的索引值
 * array： 调用方法的数组
 * initialValue 作为第一次调用 callbackfn 函数的第一个参数
 *
 * reduce() 方法为数组中的每一个元素依次执行回调函数 callbackfn ，不包括数组中被删除或从未被赋值的元素，
 * 接受四个参数：初始值（或上一次回调函数的返回值），当前元素值，当前索引，调用的数组
 *
 * 回调函数第一次执行时，preValue 和 cruValue 可以是一个值，如果 initialValue 在调用reduce()时被提供，
 * 那么第一个 preValue 等于 iinitialValue， 并且curValue等于数组中的第一个值，如果initialValue未被提供，
 * 那么 preValue 等于数组中的第一个值， curValue等于数组中的第二个值。
 **/

let arr = [1, 2, 3, 4, 5, 6];
// 求和
Array.prototype.sum = function () {
    let sumResult = 0;
    return this.reduce(function (preValue, curValue) {
        return preValue + curValue;
    });
};

// 
// 
// 模块化思维  --  立即执行函数
const sum = (function () {
    let a = 1;
    let b = 2;
    let sum = function () {
        console.log(a + b);
    };
    let sub = function () {
        console.log(a - b);
    };
    return {
        sum: sum,
        sub: sub
    }
})();

const module = (function (mod) {
    return mod;
})(window.module || {});

/**
 * 01.两数之和
 */
let s = [2, 7, 11, 15], target = 9;
const twoSum = function (s, target) {
    for (let i in nums) {
        for (let j in nums) {
            if (i != j && (nums[i] + nums[j] == target)) {
                return [i, j];
            }
        }
    }
};
twoSum(s, target);
/**
 * 03.无重复字符的最长子串
 */
s = "abcabcbb";
const longestSubstring = function (s) {
    if (s == "") {
        return 0;
    }
    let str = "", len = 1;
    for (let i = 0; i < s.length; i++) {
        str = s[i];
        for (let j = i + 1; j < s.length; j++) {
            if (s[i] == s[j] || str.indexOf(s[j]) != -1) {
                break;
            }
            str += s[j];
            if (j - i + 1 > len) {
                len = j - i + 1;
            }
        }
    }
    return len;
};
longestSubstring(s);
/**
 * 05.最长回文子串
 */
s = 'sdfsdfdsllsmbjj';
const longestPalindrome = function (s) {

    let newS = "#", strLong = "", str;
    for (let m in s) {
        newS += s[m] + "#";
    }
    for (let i = 1; i < newS.length; i++) {
        str = newS[i];
        for (let j = 1; j < newS.length; j++) {
            if (newS[i - j] == undefined || newS[i + j] == undefined) {
                break;
            }
            if (newS[i - j] == newS[i + j]) {
                str = newS[i - j] + str + newS[i - j];
            } else {
                break;
            }
        }
        if (str.length > strLong.length) {
            strLong = str;
        }
    }
    return strLong.replace(/#/g, '');
};
longestPalindrome(s);