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



$(function(){
    //准备一个商品列表信息对象
    const list_info = {
        cat_one: 'all',
        cat_two: 'all',
        cat_three: 'all',
        sort: 'id' , //id表示综合排序,price 表示 价格排序
        sortType: 'ASC',
        current: 1,
        pagesize: 10
      }
      /* 2. 把一级分类请求回来
      => 渲染一级分类列表
      2-1. 直接发送请求, 不需要参数
      2-2. 根据后端给回来的结果, 渲染一级分类列表
 */

     // 2. 请求一级分类列表
      getCatOne()
      async function getCatOne(){
        //2-1请求一级分类列表  不需要参数 和 回调函数
        const {list} = await $.get('../server/catOne.php',null,null,'json')
        //2-2渲染页面
            /* 声明一个字符串变量 
            循环遍历 拿到的每个数据，以字符串模板的书写，把每一条数据叠加到 str 上边
            把字符串 插入到 文档结构的 .right 下
            */
        let str = '<span class="active">全部</span>'
        list.forEach(item => {
            str += `<span>${item.cat_one_id}</span>`
        })
        $('.cat_one .right').html(str)

        

      }
      //3.一级分类的点击事件
          //利用事件委托，给元素集合里的内容绑定事件 由后代元素 span来触发
      $('.cat_one .right').on('click','span',function(){
        //3-1 给点击的这个元素添加一个类名 ，给他其他的所有的兄弟元素删除类名
        $(this).addClass('active').siblings().removeClass('active')
        //3-2拿到点击的这个 span 文本的分类内容
        const cat_one = $(this).text()
        //3-3 每一次的切换都要从新请求商品列表
        
        //一级列表默认的是全部 ，每点击一个 span 都会从新请求商品列表
        //一级里面的 cat_one = 点击的这个 cat_one
        list_info.cat_one = cat_one
        //任何一个的修改都应该把二级分类修改为 all
        list_info.cat_two = 'all'
         //任何一个的修改都应该把二级分类修改为 all
        list_info.cat_three = 'all'
         // 给三级列表回归
         $('.cat_three .right').html('<span class="active">全部</span>')

       
        //3-4.请求二级列表
        //条件判断，如果点击的是全部，那么不请求二级列表
        //当点击的不是全部的时候，才会请求二级列表
        if(cat_one==='全部'){
            //点击全部的时候， 给二级列表回归
            $('.cat_two .right').html('<span class="active">全部</span>')
            //因为点击的是全部，所以 cat_one:"全部"，但是后端是按all处理的所以要改成 all
            list_info.cat_one = 'all'
           
        }else{
            //请求二级分类列表
            getCatTwo()
        }
            //打印 
            console.group('根据下列 请求列表')
            console.log(list_info)      
            console.groupEnd()

             //每次点击一级分类都要从新执行请求总页数的方法
                getCount()

    })
    // 4.请求二级分类列表
    async function getCatTwo(){
        //4-1.请求数据，携带参数是 list_info.cat_one
        const {list} = await $.get('../server/catTwo.php',{cat_one:list_info.cat_one},null,'json')
        //4-2.渲染页面
        let str = '<span class="active">全部</span>'
        //循环遍历 返回的结果里的 list 数据
        list.forEach(item => {
            str += `<span>${item.cat_two_id}</span>`
        })
        $('.cat_two .right').html(str)
    }
    // 5.二级分类列表的事件
    $('.cat_two .right').on('click','span',function(){
        //5-1切换类名
        $(this).addClass('active').siblings().removeClass('active')
        //5-2拿到分类的内容
        const cat_two = $(this).text()
        //5-3修改list_info 
        list_info.cat_two = cat_two
        //修改list_info 里面的cat_three回归
        list_info.cat_three = 'all'

        //5-4.条件判断请求三级列表
        if(cat_two === '全部'){
            //让 list_info 里面的 cat_two === 'all'
            list_info.cat_two = 'all'
            $('.cat_three .right').html('<span class="active">全部</span>')
        }else{
            getCatThree()
        }
         //打印 
         console.group('根据下列 请求列表')
         console.log(list_info)      
         console.groupEnd()

         //每次切换二级分类也要从新请求总页数
         getCount()
    })
    //6.请求三级分类列表
    async function getCatThree(){
        //6-1.发送请求 需要携带参数，一级分类和二级分类
        const {list} = await $.get('../server/catThree.php',{cat_one:list_info.cat_one,cat_two:list_info.cat_two},null,'json')
        //6-2.渲染页面
        let str = '<span class="active">全部</span>'
        //循环遍历 返回的结果里的 list 数据
        list.forEach(item => {
            str += `<span>${item.cat_three_id}</span>`
        })
        $('.cat_three .right').html(str)
    }
    //7.三级分类列表的事件
    $('.cat_three .right').on('click','span',function(){
        // 7-1.切换类名
        $(this).addClass('active').siblings().removeClass('active')
        //7-2拿到点击的这个分类的内容
        const cat_three = $(this).text()
        //7-3.修改 list_info 里面的 cat_three
        list_info.cat_three = cat_three
        //7-4.条件判断
        if (cat_three === '全部'){
            list_info.cat_three = 'all'
        }

         //打印 
         console.group('根据下列 请求列表')
         console.log(list_info)      
         console.groupEnd()

         //每次切换三级分类也要从新请求总页数
         getCount()
    })

    //8.请求总页数
    getCount()
    async function getCount(){
        //8-1.发送请求
        const {count} = await $.get('../server/getCount.php',{cat_one:list_info.cat_one,cat_two:list_info.cat_two,cat_three:list_info.cat_three},null,'json')
        // console.log(res)
        //8-2.渲染分页器
        //使用 pagination 插件渲染
        new Pagination('.pagination', {
             // 表示我想配置首页按钮的文本内容
            first: '首页',
            // 表示我想配置上一页按钮的文本内容
            prev: '上一页',
            next: '下一页',
            last: '末页',
            jump: 'GO',
            total:count,        //总数的长度
            pagesize:10,        //一页显示多少条
            sizeList:[10,20,30,40],
            //每次改变当前页的时候触发
            change (current,pagesize){
                //先把list_info 里面的数据修改掉
                //current  表示的是当前页 ,默认第 1 页
                list_info.current = current
                list_info.pagesize = pagesize
                // console.log(current,pagesize)
                // console.log('请求商品列表')
                //请求商品列表
                getGoodsList()
            }

        })
    }
    //9.请求商品列表
    async function getGoodsList(){
        //9-1.请求商品列表
        const {list} = await $.get('../server/goodsList.php',list_info,null,'json')
        //9-2.渲染页面
        let str = ''
        list.forEach(item => {
            str += `
            <li class="thumbnail">
            <img src="${ item.goods_big_logo }" alt="...">
            <div class="caption">
                <h5 data-id="${ item.goods_id }">${ item.goods_name }</h5>
              <p class="price">￥ <span class="text-danger">${item.goods_price}</span></p>
              <p>
                <a href="./detail.html" class="djl btn btn-danger btn-sm" role="button">购 买</a>
                <a href="./list.html" class="btn btn-warning btn-sm" role="button">收 藏</a>
              </p>
            </div>
          </li>
            `
        })
        //插入页面
        $('.goodsList ul').html(str)
    }
    

    //10.排序方式的切换
    $('.sort_list .right').on('click','span',function () {
        
        // 10-3. 修改排序方式
        // 修改 list_info.sort 之前确定
        if (list_info.sort === this.dataset.sort) {
            list_info.sortType = list_info.sortType === 'ASC' ? 'DESC' : 'ASC'
        } else {
            list_info.sortType = 'ASC'
        }
        
        console.log('切换排序方式')
        // 10-2. 拿到你点击的这个按钮代表的排序方式
        // 设置给 listInfo 里面的 sort 属性就可以
        list_info.sort = this.dataset.sort

        // 10-4. 还原到第一页
        list_info.current = 1

         // 10-5. 切换类名
        $(this).addClass('active').siblings().removeClass('active')

        // 10-6. 请求列表数据
        getGoodsList()
    })

    
  

    //11.每一个商品的点击事件
    $('.goodsList ul').on('click','h5','',function (){
      //拿到存储在元素身上的id
      //自定义一个属性 data-id="${ item.goods_id }
      //存储在 sessionStorage 里面 (一个临时的存储空间 ，存储 key 、value)
      window.sessionStorage.setItem('goods_id',this.dataset.id)
      //跳转页面
      window.location.href = './detail.html'

      const nickname = getCookie('nickname')
      //1-2.判断 nickname 是否存在
      if(!nickname){
          //如果不存在，则跳转回到登录页，并记录是哪里跳转回来的
          window.sessionStorage.setItem('url','list')
          //跳转回登录页
          window.location.href = './login.html'
          return
      }

    })

}) 