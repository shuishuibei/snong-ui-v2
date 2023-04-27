/*
 * @Description: 首页面工具方法文件
 * @Author: caiyijun
 * @Date: 2019-08-30 16:04:34
 * @LastEditors: caiyijun
 * @LastEditTime: 2019-09-04 15:16:51
 */
export default {
  methods: {
    /**
     * @description: 从状态数组中获取某个状态的信息
     * @param status {String} 状态英文
     * @param arr {Array} 状态数组
     * @return: 符合status的状态数组
     */
    getStatusInfo(status, arr) {
      return arr.filter(function (item) {
        return item.value === status;
      });
    },
    /**
     * @description: 表格行的样式
     * @param row {type}
     * @param index {Number} 行序号 
     * @return: 样式类名
     */
    rowClassName(row, index) {
      if (index % 2 === 0) return 'ivu-table-stripe-even';
      else return 'ivu-table-stripe-odd';
    },
    /**
     * @description: 给表格内数据添加title属性
     * @param paramName {String} 参数名 
     * @return: render回调函数
     */
    tableRender(paramName) {
      return (h, params) => {
        let param = params.row[paramName];
        return h('span', {
              attrs: {title: param}
            },
            param
        );
      }
    },
    /**
     * @description: 获取promise对象方法
     * @param url {String} 请求url
     * @param success {Function} 成功回调函数 
     * @param error {Function} 失败回调函数 
     * @return: promise对象
     */
    getPromise(url, success, error) {
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(({data}) => {
          if (data.status && data.status === false) {
            error(data);
            reject(data);
          } else {
            success(data);
            resolve(data);
          }
        }).catch((e) => {
          if(error){
            error(e);
          }
          reject(e);
        })
      });
    }
  }
}