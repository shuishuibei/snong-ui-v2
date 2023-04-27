/*
 * @Description: 事件处理兼容对象
 * @Author: ys2234
 * @Date: 2019-10-30 13:41:18
 * @LastEditors: ys2234
 * @LastEditTime: 2019-10-30 17:22:05
 */
const EventUtil = {
  addHandler: function(element, type, handler) {
    if(element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if(element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  getEvent: function(event) {
    return event ? event : window.event;
  },
  getTarget: function(event) {
    return event.target || event.srcElement;
  },
  getCharCode: function(event){
    if (typeof event.charCode == 'number'){
      return event.charCode;
    } else {
      return event.keyCode;
    }
  },
  preventDefault: function(event) {
    if(event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  removeHandler: function(element, type, handler) {
    if(element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if(element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  stopPropagation: function(event) {
    if(event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
}
export default EventUtil;