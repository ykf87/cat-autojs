/**
 * 注册账号
 */
let base = require(files.path('./common/.base.js'));
module.exports = {
    handle: handle,
}

function handle(params){
    if(!base.init()){//每个文件入口必须调用
        return base.error('基础配置信息获取失败!');
    }

    var openstatus = base.openTk();
    if(openstatus === false){
        return base.error('TikTok 打开失败,请确保安装了APP');
    }
    console.log('APP打开成功!');

    var ccres = base.logsign(params['account']);
    if(ccres !== true){
        return ccres;
    }

    var btn = base.text('log_change_email');
    if(!btn){
        return base.error('邮箱登录 控件查找失败!');
    }
    if(!base.click(btn)){
        return base.error('切换到 邮箱登录 失败!');
    }

    var logbtn  = base.id('login-btn');//登录按钮
    if(!logbtn){
        return base.error('找不到登录按钮');
    }

    setText(1, params['account']);
    sleep(base.random(2000, 4000));
    setText(2, params['password']);
    sleep(1000);
    if(!base.click(logbtn)){
        return base.error('登录按钮点击失败!');
    }

    var profileBtn = base.text('profile', 20000);
    if(!profileBtn){
        return base.error('登录失败!');
    }

    base.after();
    return base.success();
}