//登录名渲染
$(function (){
    const nickname = getCookie('nickname')
    if(nickname){
        $('.off').addClass('active')
        $('.on').text(`欢迎您：${nickname} ^_^`).removeClass('active')
        //首页的购物车的联动
        //拿到 localStorage 里面存储的 list 数据
        const list = JSON.parse(window.localStorage.getItem('list')) || []
        $('.cartNum').text(list.length)
    }else{
        $('.off').removeClass('active')
        $('.on').addClass('active')
    }
})


// 下拉菜单
$('.ol1 > li').mouseenter(function () {
    // 自己放大, 兄弟元素缩小
    $(this).addClass('active').siblings().removeClass('active')
    $(this).find('ol').show()
  })
  $('.ol2').mouseleave(function () {
    // 还原到初始值
    $(this).find('ol').hide()
  })

//搜索
const ul = document.querySelector('ul')
    // 1. 给 input 绑定一个 input 事件
    const inp = document.querySelector('input')
    inp.addEventListener('input', function () {
      // 2. 拿到用户输入的内容
      const text = this.value.trim()

      // 3. 通过动态创建 script 标签的方式来发送请求
      const script = document.createElement('script')
      // 添加 src 属性
      // 原生属性, 直接元素.属性名 = 属性值
     //   script.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,33222,33306,33259,33235,32973,33351,33313,33312,33311,33310,33309,33308,33307,33145,22159,33389&wd=${ text }&req=2&csor=4&pwd=aiq&cb=bindHtml&_=1608775410035`
      script.src = `https://suggest.taobao.com/sug?code=utf-8&q=${text}&_ksTS=1610331268004_15036&callback=bindHtml&area=b2c&code=utf-8&k=1&bucketid=10&src=tmall_pc`
      // 插入到 body 内部
      document.body.appendChild(script)
      script.remove()
    })

    // 4. 准备一个请求回来的函数
    function bindHtml(res) {
      console.log(res.result)

      // 4-2. 判断是否有 g 的存在
      if (!res.result) {
        // 表示 g 不存在
        ul.style.display = 'none'
        return
      }

      // 能来到这里, 表示 res.g 存在, 那么就循环遍历 res.g 渲染页面
      let str = ''
      res.result.forEach((item ,index) => {
        str += `
          <li>${item[0] }</li>
        `
      })
      // 渲染完毕以后, 插入到 ul 内部
      ul.innerHTML = str
      // 让 ul 显示出来
      ul.style.display = 'block'
    }


    // 轮播图
    class Banner{
        //.banner传参给select
        constructor(select){
            //获取（div）下的范围元素
            this.ele = document.querySelector(select)
            //获取 .imgBox 添加到对象中
            this.imgBox = this.ele.querySelector('.imgBox')
            this.pointBox = this.ele.querySelector('.pointBox')
            this.leftBtn = this.ele.querySelector('.left')
            this.rightBtn = this.ele.querySelector('.right')
            //接受定时器的返回值
            this.timer = 0
            //表示索引的内容
            this.index = 1
            //开关
            this.flag = true
            //获取可视窗口的宽度
            this.banner_width = this.ele.clientWidth
            //启动启动器
            this.init()
        }
        //书写方法
        //1.准备一个启动器
        init() {
            this.setPorint()
            this.copyEle()
            this.autoPlay()
            this.overOut()
            this.leftRightEvent()
            this.pointEvent()
            this.tabChange()
        }
        //2.设置焦点(声明一个setPorint函数)
        setPorint(){
            const num = this.imgBox.children.length
            const frg = document.createDocumentFragment()
            for(let i = 0; i < num; i++){
                //创建元素节点 li
                const li = document.createElement('li')
                //4.判断是不是第一个li,是第一个就添加 active 类名
                if(i===0) li.classList.add('active')
                //
                li.dataset.page = i
                //把li插入到框里
                frg.appendChild(li)
            }
            this.pointBox.appendChild(frg)
            //
            this.pointBox.style.width = num * (20 + 10) +'px'
          
        }
        //3.复制元素
        copyEle(){
            //1.解构赋值，就是快速的从对象或者数组中取出成员的一个语法方式
            const {imgBox:box,banner_width:bw} = this
            //2.克隆节点
            const first = box.firstElementChild.cloneNode(true)
            const last = box.lastElementChild.cloneNode(true)
            //3.把复制的第一个插入到最后一个，复制的最后一个插入到第一个前面
            box.appendChild(first)
            box.insertBefore(last,box.firstElementChild)
            //4.从新调整宽度
            box.style.width = box.children.length * 100 + '%'
            //4.从新调整定位（定在真实的第一个图上，向左移动为负值）
            box.style.left = -bw + 'px'
        }
        //4.自动轮播
        autoPlay(){
            //1.
            this.timer = setInterval(() => {
                this.index++
                move(this.imgBox,{left:-this.index * this.banner_width},() => this.moveEnd())
            },2000)
    
        }
        //5.运动结束 (开启开关)
        moveEnd(){
            //1.结构赋值
            const {index,imgBox:box,banner_width:bw,pointBox:pBox} = this
            //2.运动到假的第一张的时候，瞬间定位到真的第一张
            if(index === box.children.length - 1){
                this.index = 1
                box.style.left = -this.index * bw + 'px'
            }
            //3.运动到假的最后一张的时候瞬间定位到真的最后一张
            if(index === 0){
                this.index = box.children.length - 2
                box.style.left = -this.index * bw + 'px'
            }
            //4.焦点配套
            //循环每一个焦点，清除样式
            for(let i = 0;i < pBox.children.length; i++){
                pBox.children[i].classList.remove('active')
            }
            //添加样式
            pBox.children[this.index-1].classList.add('active')
    
            //开启开关
            this.flag = true
    
        }
        //6.移入移出
        overOut(){
            //添加时间监听器
            this.ele.addEventListener('mouseover',() => {clearInterval(this.timer)})
            this.ele.addEventListener('mouseout',() => {this.autoPlay()})
        }
        //7.左右切换
        leftRightEvent(){
            //给左按钮添加点击事件
            this.leftBtn.addEventListener('click',() =>{
                
                //1.判断开关
                if(!this.flag) return
                this.flag = false
    
                this.index--
                move(this.imgBox,{left:-this.index * this.banner_width },this.moveEnd.bind(this))
            })
            //给右按钮添加点击事件
            this.rightBtn.addEventListener('click',() =>{
                
                //2.判断开关
                if(!this.flag) return
                this.flag = false
    
                this.index++
                move(this.imgBox,{left:-this.index * this.banner_width },this.moveEnd.bind(this))
            })
        }
        //8.焦点切换
        pointEvent(){
            //事件委托，给pointBox
            this.pointBox.addEventListener('click',(e) => {
                e = e || window.event
                const target = e.target || e.srcElement
    
                if(target.nodeName === 'LI'){
    
                    //3.判断开关
                    if(!this.flag) return
                    this.flag = false
    
                    this.index = target.dataset.page - 0 + 1
                    move(this.imgBox,{left:-this.index * this.banner_width},this.moveEnd.bind(this))
                }
            })
        }
        //9.页面切换
        tabChange(){
            //可视窗口事件
            document.addEventListener('visibilitychange',() =>{
                //可视窗口属性 （可视状态）
                const state = document.visibilityState
    
                if(state === 'hidden') {clearInterval(this.timer)}
                if(state === 'visible') {this.autoPlay()}
            })
        }
    }
    const bn = new Banner('.banner')
    console.log(bn)


    //选项卡1
    $('.btn > li').click(function() {
        $(this).addClass('active').siblings().removeClass('active')
        // $('.tab > li').eq($(this).index()).addClass('active').siblings().removeClass('active')
        $('.tab > li').removeClass('active').eq($(this).index()).addClass('active')
        console.log($(this).index())
    })
    //选项卡2
    $('.btns > li').click(function() {
        $(this).addClass('active').siblings().removeClass('active')
        // $('.tab > li').eq($(this).index()).addClass('active').siblings().removeClass('active')
        $('.tabs > li').removeClass('active').eq($(this).index()).addClass('active')
        console.log($(this).index())
    })
    //侧栏
    $('.yi-ji').on('click','li',function (){
    window.location.href = './list.html'

    })


