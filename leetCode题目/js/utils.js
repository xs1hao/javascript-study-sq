// 配置牛客网的题目名称及连接
let getInitialData = function() {
    return [
        {title: '893.特殊等价字符串组.html', address: '893.特殊等价字符串组.html'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
        {title: '数组测试1', address: 'www.baidu.com'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
        {title: '数组测试1', address: 'www.baidu.com'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
        {title: '数组测试1', address: 'www.baidu.com'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
        {title: '数组测试1', address: 'www.baidu.com'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
        {title: '数组测试1', address: 'www.baidu.com'},
        {title: '数组测试2', address: 'www.baidu.com'},
        {title: '数组测试3', address: 'www.baidu.com'},
        {title: '数组测试4', address: 'www.baidu.com'},
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
