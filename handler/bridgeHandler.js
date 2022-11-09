/** jsBridge交互处理逻辑实现 */
module.exports = {
    handle: handle,
    // 注册被调用方法，名称命名： cmd
    toast: toastAction,
    launchApp: launchAppAction,
    stop: stopAction,
    floaty: floatyAction,
    permission: permissionAction,
    tkconf: tkconfAction,
    deviceid: deviceidAction,
    asyn_return:asyn_return
}
var storage = storages.create("YKF");
var thread = null;
var tkck = 'tkconf';
var base = require(files.path('./common/.base.js'));

/**
 * 命令调度入口
 * @param {命令} cmd
 * @param {参数} params
 */
function handle(cmd, params) {
    // console.log('bridgeHandler处理 cmd=%s, params=%s', cmd, JSON.stringify(params));
    // 调度方法命名
    try {
        return this[cmd](params);
    } catch (error) {
        let dir     = '';
        if(typeof(params['path']) != 'undefined'){
            dir     = params['path'].toLowerCase().trim('/') + '/';
        }

        try {
            let js = require(files.path('./robot/' + dir + cmd + '.js'));
            stopAction();
            var res = threads.disposable();
            thread = threads.start(function(){
                toast('开始执行任务!');
                let jsres = null;
                try {
                    jsres = js.handle(params);
                } catch (error) {
                    console.log(error, '执行出错');
                    // throw new Error(error + " 执行出错");
                    return base.error('执行出错!');
                }
                res.setAndNotify(jsres);

                thread.interrupt();
            });
            let runres = res.blockedGet();
            return runres;
        } catch (error) {
            console.log(error, '=======================================');
        }
    }
    console.log(cmd, '方法未定义,请升级版本!');
    // throw new Error(cmd + " 方法未定义,请升级版本!");
    return base.error(cmd + " 方法未定义,请升级版本!");
}

/**
 * 检查无障碍权限
 */
function permissionAction(params){
    var isopenPer   = (auto.service == null) ? false : true;
    var open        = typeof(params['open']) != 'undefined' ? params['open'] : null;
    try {
        switch(open){
            case true:
                if(isopenPer == false){
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                }
            break;
            case false:
                if(isopenPer == true){
                    auto.service.disableSelf(); 
                }
            break;
        }
    } catch (error) {
        console.log(error);
    }
    console.log(isopenPer);
    return isopenPer;
}

/**
 * 停止任务
 */
function stopAction(){
    if(thread){
        thread.interrupt();
    }
}

/**
 * 处理逻辑例子： toast 提示
 */
function toastAction(params) {
    toast(params.msg);
    console.log('toast', params);
    return {msg: 'toast提示成功'};
}

/**
 * 悬浮窗控制
 */
function floatyAction(params){
    var isopenPer   = floaty.checkPermission() ? true : false;
    var open        = typeof(params['open']) != 'undefined' ? params['open'] : null;
    try {
        switch(open){
            case true:
                if(isopenPer == false){
                    floaty.requestPermission();
                    return;
                }
                var w = floaty.rawWindow(
                    <frame gravity="center">
                        <text id="getpages">获取页面</text>
                    </frame>
                );
                w.setPosition(0, 600);
                w.getpages.click(function(){
                    pageInfo();
                });
                setTimeout(()=>{
                    w.close();
                }, 20000);
            break;
            case false:
                if(isopenPer == true){
                    floaty.closeAll()
                }
            break;
        }
    } catch (error) {
        console.log(error);
    }
    return isopenPer;

    // if(!floaty.checkPermission()){
    //     toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
    //     floaty.requestPermission();
    //     return;
    // }
}

/**
 * 打开app
 * @returns
 */
function launchAppAction(params){
    launchApp(params['app']);
    toast('app 打开成功');
}

function asyn_return(){
    //call webview js
    Gevent.emit('webviewRunJs','Android_call_webview_js("hi ,call by Android '+ random()+'")')
    return function(callback){
        let ret = random()
        setTimeout(function(){
            callback(ret)
        },1000)
        /**
         *  if run in other thread ,you need use ui.run
        */
        // ui.fun(function(){
        //     //make it run in ui thread
        //     setTimeout(function(){
        //         callback(ret)
        //     },1000)
        // })
        
    }
}

/** 
 * 获取当前页面控件信息
 */
function pageInfo(){
    var list = packageName('com.zhiliaoapp.musically').find();
    // console.log(device.width, device.height);
    var js = {w: device.width, h: device.height, dt:[]};
    var i = 0;
    list.each(function(btn){
        var row = {left:0,top:0,right:0,buttom:0,w:0,h:0,txt:'',id:'',editable:false,clickable:false,class:''};

        try {
            row.txt = btn.text();
        } catch (error) {}
        try {
            row.id = btn.id();
        } catch (error) {}
        try {
            var b = btn.bounds();
            row.left = b.left;
            row.right = b.right;
            row.top = b.top;
            row.bottom = b.bottom;
            row.w = b.right - b.left;
            row.h = b.bottom - b.top;
            row.class = btn.className();
        } catch (error) {}
        try {
            row.editable = btn.editable();
        } catch (error) {}
        try {
            row.clickable = btn.clickable();
        } catch (error) {}
        js.dt[i++] = row;
    });
    console.log(JSON.stringify(js));
}


/**
 * 返回设备id
 */
 function deviceidAction(){
    console.log(device.getAndroidId());
    return device.getAndroidId();
}

/**
 * 保存配置
 */
function tkconfAction(params){
    // console.log(params.data);
    storage.put(tkck, params.data);
}
