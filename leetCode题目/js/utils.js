// 配置牛客网的题目名称及连接
let getInitialData = function() {
    return [
        {title: '893.特殊等价字符串组.html', address: '893.特殊等价字符串组.html'},
        {title: '07.传递信息.html', address: '07.传递信息.html'},
        {title: '13.罗马数字转整数.html', address: '13.罗马数字转整数.html'},
        {title: '21.合并两个有序链表.html', address: '21.合并两个有序链表.html'},
        {title: '119.杨辉三角形.html', address: '119.杨辉三角形.html'},
        {title: '169.多数元素.html', address: '169.多数元素.html'},
        {title: '190.颠倒二进制位.html', address: '190.颠倒二进制位.html'},
        {title: '283.移动零.html', address: '283.移动零.html'},
        {title: '829.连续整数求和（有多少组）.html', address: '829.连续整数求和（有多少组）.html'},
        {title: '829.连续正整数解（有多少种）.html', address: '829.连续正整数解（有多少种）.html'},
        {title: '884.两句话中不常见的单词.html', address: '884.两句话中不常见的单词.html'},
        {title: '1189.气球最大数量.html', address: '1189.气球最大数量.html'},
        {title: '1399.统计最大组的数目.html', address: '1399.统计最大组的数目.html'},
        {title: '数组测试2.html', address: 'www.html'},
        {title: '数组测试3.html', address: 'www.html'},
        {title: '数组测试4.html', address: 'www.html'},
        {title: '数组测试1.html', address: 'www.html'},
        {title: '数组测试2.html', address: 'www.html'},
        {title: '数组测试3.html', address: 'www.html'},
        {title: '数组测试4.html', address: 'www.html'},
        {title: '数组测试1.html', address: 'www.html'},
        {title: '数组测试2.html', address: 'www.html'},
        {title: '数组测试3.html', address: 'www.html'},
        {title: '数组测试4.html', address: 'www.html'},
    ]
}



/**
 * @param {?} items object from array
 * @param {?} term term's search
 * @return {?} key filter key
*/
let filter = function (items, term, key) {
    const toCompare = term.toLowerCase();
    function checkInside(item, term) {
        // for (let property in item) {
        //     if (item[property] === null || item[property] == undefined) {
        //         continue;
        //     }
        //     if (typeof item[property] === 'object') {
        //         if (checkInside(item[property], term)) {
        //             return true;
        //         }
        //     }
        //     if (item[property].toString().toLowerCase().includes(toCompare)) {
        //         return true;
        //     }
        // }
        if ( item[key] === null || item[key] == undefined ) {
            item.filter = false;
            return;
        }
        if (typeof item[key] === 'object') {
            if (checkInside(item[key], term)) {
                item.filter = true;
                return;
            }
        }
        if (item[key].toString().toLowerCase().includes(toCompare)) {
            item.filter = true;
            return;
        }
        item.filter = false;
        return;
    }
    return items.filter(function (item) {
        return checkInside(item, term)
    })
}

/**
 * 节流函数
 * callback 回调函数；
 * **/
let timer = null;
let throttle = function(callback){
    if (timer) {
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback();
        },500)
    } else {
        timer = setTimeout(function(){
            callback();
        },500)
    }
}

deepClone = function(initalObj, finalObj) {
    var obj = finalObj || {}
    for (var i in initalObj) {
        var prop = initalObj[i]

        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
        if (prop === obj) {
            continue
        }

        if (typeof prop === 'object') {
            obj[i] = prop.constructor === Array ? [] : {}
            arguments.callee(prop, obj[i])
        } else {
            obj[i] = prop
        }
    }
    return obj
}
