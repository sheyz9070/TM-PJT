$(function () {

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

    //0.准备一个全局变量表示库存
    let goods_number = 1
    //准备一个计数器 用来计数添加的商品
    let count = 1
    //准备一个变量保存商品信息
    let goods_info = null

    //1.获取商品id
    const id = window.sessionStorage.getItem('goods_id')
    //1-2.判断id 是否存在
    //2.获取商品信息
    getGoodsInfo()
    async function getGoodsInfo(){
        const res = await $.get('../server/goodsInfo.php',{id},null ,'json')
       
        bindHtml(res.info)
    }
    //3.渲染页面
    function bindHtml(info){

        //给全局变量进行赋值
        goods_number = info.goods_number
        goods_info = info   //info 信息

        let s1 = `
    <div class="enlargeBox">
        <div class="show">
          <img src="${info.goods_big_logo}" alt="">
          <!-- 遮罩层盒子 -->
          <div class="mask"></div>
        </div>
        <div class="list">
          <p class="active">
            <img src="${info.goods_small_logo}" alt="">
          </p>
        </div>
        <!-- 放大镜盒子 -->
        <div class="enlarge" style="background-image: url(${info.goods_big_logo});"></div>

      </div>

      <div class="goodsInfo">
        <p class="desc">${info.goods_name}</p>
        <div class="btn-group size">
          <button type="button" class="btn btn-default">S</button>
          <button type="button" class="btn btn-default">M</button>
          <button type="button" class="btn btn-default">L</button>
          <button type="button" class="btn btn-default">XL</button>
        </div>
        <p class="price">
          ￥ <span class="text-danger">${info.goods_price}</span>
        </p>
        <div class="num">
          <button class="sub">-</button>
          <input class="number" type="text" value="1">
          <button class="add">+</button>
        </div>
        <div>
          <button class="add_cart btn btn-success">加入购物车</button>
          <button class="btn btn-warning">继续去购物</button>
        </div>
      </div>
        `
        $('.goodsDetail').html(s1)

        //商品详情的渲染
        // $('.goodsDesc').html(info.goods_introduce)
    }
})
$('body').on('mouseover','.goodsDetail',function(){

    function Enlarge(select) {
        // 范围元素
        this.ele = document.querySelector(select)
        // show 盒子: 范围内的 .show
        this.show = this.ele.querySelector('.show')
        // mask 盒子
        this.mask = this.ele.querySelector('.mask')
        // enlarge 盒子
        this.enlarge = this.ele.querySelector('.enlarge')
        // list 盒子
        this.list = this.ele.querySelector('.list')
        // show 盒子的宽度
        this.showWidth = this.show.clientWidth
        // show 盒子的高度
        this.showHeight = this.show.clientHeight
        // 背景图宽度
        this.bgWidth = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
        // 背景图高度
        this.bgHeight = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
        // enlarge 盒子的宽度
        this.enlargeWidth = parseInt(window.getComputedStyle(this.enlarge).width)
        // enlarge 盒子的高度
        this.enlargeHeight = parseInt(window.getComputedStyle(this.enlarge).height)
    
        // new 完就直接出现效果
        // 直接调用启动器
        this.init()
    }

    // 提前准备一个方法叫做启动器
    Enlarge.prototype.init = function () {
        this.overOut()
        this.setScale()
        this.setMove()
    }
    /*
    移入移出
        + 给谁绑定事件 ?
        => 给该实例的 show 盒子绑定事件
        + 移入的时候 ?
        => 让该实例的 mask 和 enlarge 显示
        + 移出的时候 ?
        => 让该实例的 mask 和 enlarge 消失
    */
    Enlarge.prototype.overOut = function () {
        // 移入事件
        this.show.addEventListener('mouseover', () => {
        this.mask.style.display = 'block'
        this.enlarge.style.display = 'block'
        })
        // 移出事件
        this.show.addEventListener('mouseout', () => {
        this.mask.style.display = 'none'
        this.enlarge.style.display = 'none'
        })
    }
    /*
    调整比例

    需要四个内容成为这个样子的比例
        show 盒子尺寸      背景图尺寸
        ------------ = --------------
        mask 盒子尺寸   enlarge 盒子尺寸
    公式变形
        mask 盒子尺寸 * 背景图尺寸 = show 盒子尺寸 * enlarge 盒子尺寸
        mask 盒子尺寸 = show 盒子尺寸 * enlarge 盒子尺寸 / 背景图尺寸
    1. 计算出 mask 盒子的尺寸
    2. 给 mask 盒子进行赋值
    */
  Enlarge.prototype.setScale = function () {
    // 1. 计算 mask 盒子的尺寸
    this.maskWidth = this.showWidth * this.enlargeWidth / this.bgWidth
    this.maskHeight = this.showHeight * this.enlargeHeight / this.bgHeight
  
    // 2. 给 mask 盒子赋值
    this.mask.style.width = this.maskWidth + 'px'
    this.mask.style.height = this.maskHeight + 'px'
  }

    /* 
    移动联动

    */
  Enlarge.prototype.setMove = function () {
    // 1. 给 this.show 绑定事件
    this.show.addEventListener('mousemove', e => {
      // 处理事件对象兼容
      e = e || window.event
  
      // 2. 获取坐标了
      let moveX = e.offsetX - this.maskWidth / 2
      let moveY = e.offsetY - this.maskHeight / 2
  
      // 3. 边界值判断
      if (moveX <= 0) moveX = 0
      if (moveY <= 0) moveY = 0
      if (moveX >= this.showWidth - this.maskWidth) moveX = this.showWidth - this.maskWidth
      if (moveY >= this.showHeight - this.maskHeight) moveY = this.showHeight - this.maskHeight
  
      // 4. 赋值
      this.mask.style.left = moveX + 'px'
      this.mask.style.top = moveY + 'px'
  
      // 5. 计算背景图移动距离
      const bgX = moveX * this.enlargeWidth / this.maskWidth
      const bgY = moveY * this.enlargeHeight / this.maskHeight
  
      // 给 enlarge 盒子的 backgroundPosition 进行赋值
      this.enlarge.style.backgroundPosition = `-${ bgX }px -${ bgY }px`
    })
  }
  new Enlarge ('.goodsDetail')

})

