const { launchApp } = require("../../handler/bridgeHandler");

/**
 * 注册账号
 */
let base = require(files.path('./common/.base.js'));
module.exports = {
    handle: handle,
}

function handle(params){
    base.init();
    var openstatus = base.openTk();
    if(openstatus !== true){
        return base.error(openstatus);
    }

    var profile     = text(base.idlang['txt']['profile']).findOne(10000);
    if(!profile){
        var islogin = text(base.idlang['txt']['logtxt']).findOne(5000);//如果直接到登录页面,说明没有已登录的账号
        if(!islogin){
            return base.error('');
        }
    }else{

    }

    return {account: 'sdfsdf'}
}