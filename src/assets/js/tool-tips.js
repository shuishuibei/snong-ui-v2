const SameNameTips = {
  functional: true,
  render: function (h, context) {
    return h(
      'div',
      {
        slot: 'content'
      },
      [
        h('p', '长度1~42个字符，允许输入中文、大小'),
        h('p', '写英文字母、数字以及括号中的英文字'),
        h('p', '符（.-@_），且不能以字符（.-@_）作'),
        h('p', '为开始字符')
      ]
    )
  }
}

const SamePasswordTips = {
  functional: true,
  render: function (h, context) {
    return h(
      'div',
      {
        slot: 'content'
      },
      [
        h('p', '长度为8~20个字符，必须由数字、大小写'),
        h('p', '字母以及括号中的特殊字符（!@#$%^&*?）'),
        h('p', '三种中的两种组成')
      ]
    )
  }
}

const TelephoneTips = {
  functional: true,
  render: function (h, context) {
    return h(
      'div',
      {
        slot: 'content'
      },
      [
        h('p', '该值必须是11位手机号'),
        h('p', '如：13806504476')
      ]
    )
  }
}

export { SameNameTips, SamePasswordTips, TelephoneTips }