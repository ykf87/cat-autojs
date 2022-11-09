/**
 * 初始化设备
 * 初始化app的内容,获取app语言和版本
 * 如果检测到账号已登录,则获取账号信息
 */
let base = require(files.path('./common/.base.js'));
module.exports = {
    handle: handle,
}

function handle(params){
    base.log('开始初始化app!');
    params = Object.assign(base.params, params);

    var opres;
    if(params['package']){
        opres = launch(params['package']);
    }else{
        opres = launchApp(params['appname']);
    }
    console.log(opres);
    if(!opres){
        base.log('App 打开失败,请确保安装了该app');
        return;
    }
    sleep(3000);

    click(device.width * 0.9, device.height * 0.967);
    return true;
    // var profile = id('dmr').findOne(5000);
    // console.log(profile.bounds().centerX(), profile.bounds().centerY(), base.width, base.height);//972 1857 1080 1920 
}