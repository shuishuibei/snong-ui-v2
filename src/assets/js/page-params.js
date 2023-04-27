/*
 * @Description: 分页构造函数对象
 * @Author: caiyijun
 * @Date: 2019-09-05 14:11:57
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-10-12 10:34:00
 */

let PageParams = function({loading = true,current = 1,size = 20,total = 0,data = [],showData = [],pageSizeOpts = [10, 20, 30, 50]} = {}){
    this.loading = loading;
    this.current = current;
    this.size = size;
    this.total = total;
    this.data = data;
    this.showData = showData;
    this.pageSizeOpts = pageSizeOpts;
    this.pageNum = (Math.ceil(this.total / this.size) === 0 ? 1 : Math.ceil(this.total / this.size));
}

/**
 * @description: 获取总页数
 * @return: null
 */
PageParams.prototype.getPageNum = function(){
    this.pageNum = (Math.ceil(this.total / this.size) === 0 ? 1 : Math.ceil(this.total / this.size));
    return this.pageNum;
}

/**
 * @description: 给分页对象填入所有数据（注:showData是当前页展示数据，data是所有数据，由前端做分页时用到）
 * @param arr {Array} 表格数据
 * @return: null
 */
PageParams.prototype.setData = function(arr = []){
    if (typeof arr === 'object' && arr.constructor.name === 'Array') {
        this.data = arr;
      } else {
        throw '设置data时输入的参数不是数组';
      }
}

export {PageParams};
