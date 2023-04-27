/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:43
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 11:07:06
 */
/**
 * meta中的title是显示在浏览器上方的title
 */
import rLogin from './routes/login';
import rJoin from './routes/join'
import rHome from './routes/a-home';
import rResourceDirectory from './routes/resource-directory';
import rResourceManage from './routes/resource-manage';
import rResourceMeasure from './routes/resource-measure';
import rProcessManagement from './routes/process-manage';
import rSystemManage from './routes/system-manage';
import rOperationLog from './routes/operatio-log';
import rException from './routes/exception';

import rOrderManage from './routes/order-manage';

/**
 * 运维平台新增
 */

import rPersonalReport from './routes/personal-report';
import rOpsManage from './routes/ops-manage';




import rWhiteScreen from './routes/white-screen';


/**
 * 运维平台改版路由
 */
import rMonitorAlarm from './routes/monitor-alarm';


export default [
  //rLogin该路由必须在数组的第一个,因为一些路由也是挂在到Main组件下,path="/",重定向会出错
  ...rLogin,
  rJoin,
  rHome,

  rResourceDirectory,
  rResourceManage,
  rProcessManagement,
  rSystemManage,
  rOperationLog,
  // rDevTemplate,
  ...rException,
  rOrderManage,
  rResourceMeasure,
  rPersonalReport,
  rOpsManage,

  // rOpsControl,
  rWhiteScreen,


  rMonitorAlarm
];
