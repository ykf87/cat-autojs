var storage = storages.create("YKF");
var tkck    = 'tkconf';

var base = {
    width: device.width,
    height: device.height,
    idlang: null,
    storage: storage
};
base.init = function(){
    device.keepScreenOn();
    var idlang = storage.get(tkck);
    // console.log(typeof(idlang), typeof(idlang['txt']),idlang);
    if(!idlang){
        console.log('未找到配置!');
        return false;
    }
    if(typeof(idlang['txt']) == 'undefined'){
        console.log('找不到配置!');
        return false;
    }
    if(typeof(idlang['id']) == 'undefined'){
        console.log('找不到配置!!');
        return false;
    }
    base.idlang = idlang;
    return true;
};

/**
 * 正确执行完脚本要调用此方法
 */
base.after = function(){
    device.cancelKeepingAwake();
    toast('执行完毕!');
    //每次执行完毕后,将tk退回到首页
    back();
    sleep(1000);
    back();
    sleep(1000);
    back();
    sleep(1000);
}

base.params = {
    appname: 'Tiktok',
    package: ''
};
base.log = function(msg){
    console.log(msg);
    toast(msg);
}
base.error = function(msg){
    console.log(msg);
    return {code: 500, msg: msg, data: null};
}
base.success = function(data, msg){
    return {code: 200, msg: msg, data: data};
}

base.back = function(times, timeout){
    if(typeof(times) == 'undefined' || times < 1){
        times = 1;
    }
    if(typeof(timeout) == 'undefined' || timeout < 0){
        timeout = 1000;
    }
    for(var i = times;i >= 0; i--){
        back();
        sleep(timeout);
    }
}

/**
 * 打开tk,并且处理一些逻辑,确保打开后的页面在首页
 * @returns bool or text
 */
base.openTk = function(appname){
    if(!appname){
        appname = 'TikTok';
        appname = 'WireGuard';
    }
    home();
    sleep(1000);
    if(!launchApp(appname)){//TikTok
        return false;
    }
    base.packname = app.get
    console.log('打开APP');
    var profile     = base.text('profile', 15000);
    if(!profile){
        console.log('找不到 profile');
        //按两次返回按钮,防止tiktok在其他页面
        base.back(3);
    }
    console.log('再找 profile');
    profile     = base.text('profile', 5000);
    if(!profile){//如果找不到 profile ,则尝试查找是否自动跳转到登录页
        var signpage = base.text('signpage', 0);
        var logpage = base.text('islogpage', 0);
        if(signpage){
            return 'sign';
        }else if(logpage){
            return 'login';
        }
        return false;
    }
    return true;
    //需要处理一些弹窗
}

//点击
base.click = function(btn){
    var b = btn.bounds();
    if(click(b.centerX(), b.centerY())){
        sleep(1500);
        return true;
    }
    return false;
}

/**
 * js去头尾
 */
base.trim = function(str, x) {
    if(x){
        var len     = x.length;
        for(var i = 0; i < len; i++){
            var reg     = new RegExp('^' + x[i] + '+|' + x[i] + '+$', 'gm');
            str         = str.replace(reg, '');
        }
        return str;
    }else{
        return str.replace(/^\s+|\s+$/gm,'');
    }
}


/**
 * ID查找封装,支持查找.
 * *id* 将查找含 id 的控件
 * id*  将查找 id 开头的控件
 * *id  将查找以 id 结尾的控件
 */
base.id = function(txt, timeout, isall, useconf){
    if(typeof(timeout) == 'undefined'){
        timeout = 3000;
    }
    if(typeof(isall) == 'undefined'){
        isall = false;
    }
    if(typeof(useconf) == 'undefined'){
        useconf = true;
    }
    if(useconf === true){
        if(!typeof(base.idlang['id'][txt])){
            console.log('id 查找失败!', txt);
            return false;
        }
        txt     = base.idlang['id'][txt];
    }
    if(!txt){
        toast('不存在的 id');
        return false;
    }

    var prev = txt.substring(0, 1);
    var end = txt.substring(1, -1);
    // txt     = base.trim(txt, ' ');
    // txt     = base.trim(txt, '*');
    if(prev == '*' && end == '*'){
        txt = txt.substring(1, -1);
        return isall ? idContains(txt).find(timeout) : idContains(txt).findOne(timeout);
    }else if(prev == '*'){
        txt = txt.substring(1);
        return isall ? idStartsWith(txt).find(timeout) : idStartsWith(txt).findOne(timeout);
    }else if(end == '*'){
        txt = txt.substring(-1);
        return isall ? idEndsWith(txt).find(timeout) : idEndsWith(txt).findOne(timeout);
    }
    return isall ? id(txt).find(timeout) : id(txt).findOne(timeout);
}

/**
 * 类似上面的 id 查找,此处查找 文本
 * @param txt       text    待查找的文本,支持使用 * 号匹配
 * @param timeout   number  查找超时时间,单位毫秒
 * @param isall     bool    是否查找所有控件
 * @param useconf   bool    是否需要从配置中映射,如果设置为false,则直接查找 txt
 */
base.text   = function(txt, timeout, isall, useconf){
    console.log('找text', txt);
    if(typeof(timeout) == 'undefined'){
        timeout = 3000;
    }
    if(timeout < 100){
        timeout = 200;
    }
    if(typeof(isall) == 'undefined'){
        isall = false;
    }
    if(typeof(useconf) == 'undefined'){
        useconf = true;
    }
    if(useconf === true){
        try {
            txt     = base.idlang['txt'][txt];
        } catch (error) {
            console.log(base.idlang['txt']);
            // throw new Error('文本 查找失败! ' + txt);
            return false;
        }
        // if(!typeof(base.idlang['txt'][txt])){
        //     console.log('文本 查找失败!', txt);
        //     return false;
        // }
        // txt     = base.idlang['txt'][txt];
    }
    if(!txt){
        toast('不存在的 text');
        return false;
    }
    var prev = txt.substring(0, 1);
    var end = txt.substring(1, -1);
    // try {
    //     txt     = base.trim(txt, ' ');
    //     txt     = base.trim(txt, '*');
    // } catch (error) {
    //     console.log(error);
    // }
    // console.log('找text7777', txt, end);
    if(prev == '*' && end == '*'){
        txt = txt.substring(1, -1);
        return isall ? textContains(txt).find(timeout) : textContains(txt).findOne(timeout);
    }else if(prev == '*'){
        txt = txt.substring(1);
        return isall ? textStartsWith(txt).find(timeout) : textStartsWith(txt).findOne(timeout);
    }else if(end == '*'){
        txt = txt.substring(-1);
        return isall ? textEndsWith(txt).find(timeout) : textEndsWith(txt).findOne(timeout);
    }
    console.log(txt, timeout, '-----------------');
    if(isall == true){
        return text(txt).find(timeout);
    }
    return text(txt).findOne(timeout);
}

/**
 * 随机数
 */
base.random = function(minNum, maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
        default:
            return 0;
        break;
    }
}

/**
 * 概率
 * 返回本次是否命中概率
 */
base.prob   = function(probability){  
    var probability = probability*100 || 1;
    var odds = Math.floor(Math.random()*100);

    if(probability === 1){
        return true;
    };
    if(odds < probability){
        return true;
    }else{
        return false;
    }
}

/**
 * 在屏幕内的控件
 * 场景为有多个属性相同的控件
 * 如: base.inscreen(id('btn'))
 * 将返回在屏幕内的控件
 */
base.inscreen   = function(obj){
    var arrs        = obj.find();
    if(!arrs){
        return null;
    }
    var findBtn     = null;
    arrs.each(function(btn){
        var b       = btn.bounds();
        var l       = b.left;
        var r       = b.right;
        var t       = b.top;
        var bt      = b.bottom;
        if(l > 0 && r < w && t > 0 && bt < h){
            findBtn = btn;
            return findBtn;
        }
    });
    return findBtn;
}

/**
 * 跳转到 登录/注册 页面
 * 调用此方法,必须确保已经在 profile 页面, 也就是个人中心页面
 * @param {string} account 需要 登录/注册 的账号
 * @param {number} type 1-登录  2-注册
 */
base.logsign = function(account, type){
    if(typeof(type) == 'undefined'){
        type = 1;
    }
    var addAccount = base.id('profile_change_account', 0);
    if(!addAccount){
        return '找不到 个人中心顶部切换账号按钮';
    }

    if(!base.click(addAccount)){
        return '个人中心顶部切换账号按钮 无法点击';
    }

    var addbtn = base.text('addaccount', 10000);
    if(!addbtn){
        return '找不到 弹出的窗口中的添加账号 按钮!';
    }

    //需要登录的账号已经在 已登录 列表中
    var logusernamebtn  = base.text('*' + account, 0, false, false);
    if(logusernamebtn){
        base.click(logusernamebtn);
        sleep(10000);
        return true;
    }
    var is_addbtn_click_success = base.click(addbtn);
    if(!is_addbtn_click_success){
        return '点击 添加账号 按钮失败!';
    }

    //查找切换 注册 或 登录 按钮,找到了说明是在登录页面,找不到为不能正常打开登录或注册
    var logchangebtn    = base.id('dh8', 15000);
    if(!logchangebtn){
        return '找不到 登录或注册页面相互切换按钮';
    }

    var signpage = base.text('signpage', 0);
    var logpage = base.text('islogpage', 0);

    if((type == 1 && !logpage) || (type == 2 && !signpage)){
        if(!base.click(logchangebtn)){
            return '点击切换按钮失败!';
        }
    }
    var chooseTypeBtn = base.text('choose_log_sign_type', 1000);
    if(!chooseTypeBtn){
        return '找不到 登录/注册 方式';
    }
    var res = base.click(chooseTypeBtn);
    return res ? true : '点击 登录/注册 方式失败!';
}

module.exports = base;