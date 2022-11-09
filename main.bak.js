if(!launchApp('TikTok')){
    console.log('未能正常打开 TikTok!');
}
sleep(5000);

//按两次返回按钮,防止tiktok在其他页面
back();
sleep(1200);
back();

var params = {account: 'blandal.com@gmail.com', password: 'Abcde@12345'};
// login(params);
function login(params){
    var profile     = text('Profile').findOne(10000);
    if(profile){
        base.click(profile);
        /**
         * 如果能找到切换按钮,则说明账号已登录
         */
        var switchBtn  = id('dwx').findOne(3000);
        console.log('33333');
        if(switchBtn){
            switchBtn.click();
            sleep(1200);
            //此处需要检查欲登录的账号是否已经登录,如果登录则切换
            var had = text(params['account']).findOne(3000);
            console.log('44444');
            if(had){
                had.click();
                console.log('登录成功!');
                return;
            }

            var addacount = text('Add account').findOne(3000);
            console.log('55555');
            if(!addacount){
                console.log('无法找到添加账号按钮');
                return;
            }
            addacount.click();
            sleep(1200);
        }
    }

    var phonemailbtn = id('asn').findOne(5000);//登录页面的选择电话/邮箱/用户名登录
    console.log('66666');
    if(!phonemailbtn){
        console.log('找不到登录口!');
        return;
    }
    phonemailbtn.click();
    sleep(1200);
    var btn     = textContains('Username').findOne(3000);//切换到邮箱登录
    console.log('8888');
    if(!btn){
        console.log('无法切换到邮箱登录!');
        return;
    }
    if(!btn.parent().click()){
        console.log('无法点击邮箱登录!');
        return;
    }
    sleep(1000);

    var logbtn  = id('bds').findOne(3000);//登录按钮

    sleep(1200);
    setText(1, params['account']);
    setText(2, params['password']);
    sleep(8000);
    logbtn.click();
    console.log('成功!');
}

