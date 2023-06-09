/*
 iview的transfer使用了HTMLElement.dataset方法,而在ie8、9中没有该方法
 */
if (window.HTMLElement) {
  if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
      get: function () {
        let attributes = this.attributes; // 获取节点的所有属性
        let obj = {}; // 定义一个空对象
        for (let i = 0; i < attributes.length; i++) { // 遍历节点的所有属性
          if (attributes[i].nodeName.slice(0, 5) === 'data-') { // 如果属性名的前面5个字符符合"data-"
            // 取出属性名的"data-"的后面的字符串并转换为驼峰式

            let _key = attributes[i].nodeName.slice(5).replace(/-([a-z])/g, function ($1, $2) {
              return $2.toUpperCase();
            });

            let _value = attributes[i].nodeValue; // 取出对应的属性值
            obj[_key] = _value;  // 将key和value放入对象中
          }
        }
        return obj; // 返回对象
      }
    });
  }
}

// 由于ie9没有此方法,用该方法只能取到近似值
if (!window.performance.now) {
  window.performance.now = function () {
    return Date.now() - window.performance.timing.navigationStart;
  };
}
