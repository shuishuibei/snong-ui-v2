/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:41
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-10-08 17:18:28
 */
/**
 * 表单验证规则统一文件
 * @type {{modelName: *[], category: *[]}}
 */

// 开发模板检验规则
export const devTemplateRule = {
  url: [{
    required: true,
    message: 'URL不能为空',
    trigger: 'blur'
  }]
};

// 流程模板校验规则
export const processTemplateRule = {
  modelName: [{
    required: true,
    message: '模板名称不能为空',
    trigger: 'blur'
  }],
  categoryCopy: [{
    required: true
  }]
};

/**
 * @function required
 * @description 校验不能为空
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.type
 * @param {String} option.trigger
 * @returns {Object}
 */
export function required({
  message = '不能为空',
  type = 'string',
  trigger = 'blur'
} = {}) {
  return {
    required: true,
    type,
    message,
    trigger
  };
}

/**
 * @function mobilePhone
 * @description 校验手机号码
 * @param {Object} option
 * @param {string} option.message
 * @param {string} option.trigger
 * @returns {Object}
 */
export function mobilePhone({
  message = '手机号码格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value !== '') {
        let reg = /^1(3\d{1}|8\d{1}|5([0-3]|[5-9]){1}|4(0|[5-7]|9){1}|7([0-3]|[5-8]){1}|6(2|[5-7])|9(1|[8-9]))(\d{8})$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback();
      }
    },
    trigger
  };
}

/**
 * @function landlinePhone
 * @description 校验座机号码
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function landlinePhone({
  message = '座机号码格式不正确',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let reg = /^((?:010)|(?:0[2-9]{1}[0-9]{1,2})|(?:852|853))-\d{7,8}$/;
      reg.test(value) ? callback() : callback(message);
    },
    trigger
  };
}

/**
 * @function allPhone
 * @description 同时校验手机号码和座机号码
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function allPhone({
  message = '手机号码或座机号码格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (!value) {
        callback();
      }
      let firstValue = value[0];
      if (firstValue === '0') {
        let reg = /^((?:010)|(?:0[2-9]{1}[0-9]{1,2})|(?:852|853))-\d{7,8}$/;
        reg.test(value) ? callback() : callback(message);
      } else if (firstValue === '1') {
        let reg = /^1(3\d{1}|8\d{1}|5([0-3]|[5-9]){1}|4(0|[5-7]|9){1}|7([0-3]|[5-8]){1}|6(2|[5-7])|9(1|[8-9]))(\d{8})$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback(message);
      }
    },
    trigger
  };
}

/**
 * @function allPhoneChange
 * @description 再输入时验证格式是否符合
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function allPhoneChange({
  message = '号码不符合格式',
  trigger = ' change'
} = {}) {
  return {
    validator(rule, value, callback) {
      let firstValue = value[0];
      if (firstValue === '0' || firstValue === '1') {
        if (firstValue === '0') {
          if (value.search(/\d-\d/) > -1) {
            callback();
          } else {
            callback(message);
          }
        } else {
          if (value.search(/^1\d+/) > -1) {
            callback();
          } else {
            callback(message);
          }
        }
      } else {
        callback(message);
      }
    },
    trigger
  };
}

/**
 * @function ip
 * @description 校验IP
 * @param {Object} option
 * @param {String} option.message
 * @param {Function | Boolean} option.http
 * @param {String} option.trigger
 * @returns {Object}
 */
export function ip({
  message = 'IP格式不正确',
  http = false,
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let reg = /^(([0-1]?\d{1,2}\.)|(2(5[0-5]|[0-4]\d)\.)){3}(([0-1]?\d{1,2})|(2(5[0-5]|[0-4]\d)))?$/;
      if (value) {
        if (reg.test(value)) {
          http ? http(callback, value) : callback();
        } else {
          callback(message);
        }
      } else {
        callback();
      }
    },
    trigger
  };
}


/**
 * @function portValidate
 * @description 校验端口
 * @param {Object} option
 * @param {string} option.message - 提示信息
 * @param {string} option.trigger - 触发方式
 */
export function port({
  message = '端口格式不正确',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value > 65535) {
        callback('端口号最大不能超过65535');
      } else {
        let reg = /^[1-9]\d{0,5}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error(message));
        }
      }
    },
    trigger
  }
}

/**
 * @function int
 * @description 校验输入的是否是整数
 * @param {Object} option
 * @param {String} option.message
 * @param {Number} option.min
 * @param {String} option.trigger
 * @returns {Object}
 */
export function int({
  message = '输入数字格式不正确,请输入整数',
  min = 0,
  trigger = 'blur',
} = {}) {
  return {
    validator(rule, value, callback) {
      let num = +value;
      Number.isInteger(num) && num > min ? callback() : callback(message);
    },
    trigger
  };
}

/**
 * @function float
 * @description 校验是否输入的是小数
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function float({
  message = '输入小数格式不正确',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let num = +value;
      Number.isInteger(num) ?
        callback(message) :
        Number.isNaN(num) ?
          callback(message) :
          callback();
    },
    trigger
  };
}

/**
 * @function even
 * @description 校验是否输入的偶数
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function even({
  message = '输入的不是偶数',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let num = +value;
      Number.isNaN(num) ?
        callback(message) :
        Number.isInteger(num) ?
          num % 2 === 0 ?
            callback() :
            callback(message) :
          callback(message);
    },
    trigger
  };
}

/**
 * @function max
 * @description 校验值是否大于他的最大值
 * @param {Object} option
 * @param {String} option.message
 * @param {Number | Array} option.max
 * @param {Number | String} option.key
 * @param {String} option.trigger
 * @returns {Object}
 */
export function max({
  message,
  max,
  key,
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback, resourse) {
      let nums = +value;
      if (Array.isArray(max)) {
        let index = parseInt(/[0-9]{1}/g.exec(Object.keys(resourse)));
        nums > max[index][key] ? callback(message + '' + max[index][key]) : callback();
      } else {
        nums > max ? callback(message + '' + max) : callback();
      }
    },
    trigger
  }
}

/**
 * @function odd
 * @description 校验是否输入的是奇数
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function odd({
  message = '输入的不是奇数',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let num = +value;
      Number.isNaN(num) ?
        callback(message) :
        Number.isInteger(num) ?
          num % 2 === 0 ?
            callback(message) :
            callback() :
          callback(message);
    },
    trigger
  };
}

/**
 * @function name
 * @description 校验输入的是否符合名称的格式
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function name({
  message = '名称不符合格式',
  trigger = 'blur'
} = {}) {
  return {
    validator(rule, value, callback) {
      let reg = /^((?![\n\r^\\])[A-z])((?![\n\r^\\])[A-z0-9-]){0,31}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(message);
      }
    },
    trigger
  };
}

/**
 * @function password
 * @description 校验密码，长度8-20位，必須包含数字、字母和特殊字符(!@#$&*_)这三种类型
 * @param {Object} option
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function password({
  message = '密码不符合格式',
  trigger = 'blur'
} = {}) {
  let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$&*_])[a-zA-Z0-9!@#$&*_]{8,20}$/;
  return {
    validator(rule, value, callback) {
      reg.test(value) ? callback() : callback(message);
    },
    trigger
  };
}

/**
 * @function confirmPassword
 * @description 确认密码校验
 * @param {Object} option
 * @param {Object} option._this
 * @param {String} option.message
 * @param {String} option.trigger
 * @returns {Object}
 */
export function confirmPassword({
  _this,
  message = '两次密码不一致',
  trigger = 'blur'
}) {
  return {
    validator(rule, value, callback) {
      if (_this.formValidate.password === value) {
        callback();
      } else {
        callback(message);
      }
    },
    trigger
  };
}

/**
 * @function identityCards
 * @description 校验证件号码（身份证号码）
 * @param {Object} option
 * @param {string} option.message - 验证不通过时提示信息
 * @param {string} option.trigger - 触发方式
 * @returns {Object}
 */
export function identityCards({
  message = '证件号码格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value !== '') {
        let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback();
      }
    },
    trigger
  }
}

/**
 * @function email
 * @description 校验邮箱
 * @param {Object} option
 * @param {string} option.message - 验证不通过时提示信息
 * @param {string} option.trigger - 触发方式
 * @returns {Object}
 */
export function email({
  message = '邮箱格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value !== '') {
        let reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback();
      }
    },
    trigger
  }
}


/**
 * @function 校验登录名称、组织名称、资源池名称、角色名称
 * @description 长度1~42个字符，允许输入中文、大小写英文字母、数字以及括号中的英文字符（.-@\_），且不能以字符（.-@_）作为开始字符
 * @param {Object} option
 * @param {string} option.message - 验证不通过时提示信息
 * @param {string} option.trigger - 触发方式
 * @returns {Object}
 */
export function sameName({
  message = '登录名格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value !== '') {
        let reg = /^[\u4E00-\u9FA5A-Za-z0-9][\u4E00-\u9FA5A-Za-z0-9.\-@_]{0,41}$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback();
      }
    },
    trigger
  }
}

export function samePassword({
  message = '密码格式不正确',
  trigger = 'blur change'
} = {}) {
  return {
    validator(rule, value, callback) {
      if (value !== '') {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![!@#$%^&*?]+$)([a-z]|[A-Z]|[0-9]|[!@#$%^&*?]){8,20}$/;
        reg.test(value) ? callback() : callback(message);
      } else {
        callback();
      }
    },
    trigger
  }
}