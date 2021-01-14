 //入口函数 书写代码
 $(function (){
    //1-1登录按钮添加点击事件
    $('.login').click(async () => {
        //1-2拿到用户输入的内容
        const username = $('#username').val()
        const password  = $('#password').val()
        //1-3条件判断输入框为空（非空验证）
        if(!username || !password) return alert('表单不符合规则')
        //1-4正则判断 输入内容 是否 符合要求（正则验证）
        if(!/^[a-z0-9]\w{4,11}$/i.test(username) || !/^\w{6,12}$/i.test(password)) return alert('表单不符合规则')
        //1-5提交到后端
        const {code,nickname} = await $.post('../server/login.php',{username,password},null,'json')
        //1-6通过返回的结果来进行操作
        if(!code) return alert('用户名密码错误')
        //代码执行到这里表示可以登录
        //给cookie存储一个标识符 用来登录成功显示
        setCookie('nickname',nickname,60*60*24)
        //获取sessionStorage 里面的url 信息，如果有，跳转到信息所在的页面
        //如果没有跳转到首页
        const url = window.sessionStorage.getItem('url')
        //跳转页面
        window.location.href = `./${url ? url : 'index'}.html`
    })
    // console.log("js")
})