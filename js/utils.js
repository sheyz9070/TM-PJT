function move(ele, target, fn) {
  let count = 0
  for (let key in target) {
    if (key === 'opacity') target[key] *= 100
    count++
    const timer = setInterval(() => {
      // 1. 获取当前值
      let current
      if (key === 'opacity') current = window.getComputedStyle(ele)[key] * 100
      else current = parseInt(window.getComputedStyle(ele)[key])

      // 2. 计算本次运动的距离
      let distance = (target[key] - current) / 10
      distance = distance > 0 ? Math.ceil(distance) : Math.floor(distance)

      // 3. 判断是否到达目标位置
      if (current === target[key]) {
        clearInterval(timer)
        count--
        if (!count) fn()
      } else {
        if (key === 'opacity') ele.style[key] = (current + distance) / 100
        else ele.style[key] = current + distance + 'px'
      }
    }, 20)
  }
}
