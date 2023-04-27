export const areaList = ['东区','南区','西区','北区'];
export const servicePropertyList = ['随项目','单独销售','提前交付','其他'];
export const paySpecList = ['8814A0BG','8814A0BS','8814A0E7',
  '8814A0PP','8814A0XJ','8814A0XK',
  '8814A0Y8','8814A109'];
export const projectTradeList = ["政务云","移动","证券","党政","广电","教育","保险","央企与智能制造","银行二部","电力能源","财税民生",
  "电网","电信","公共安全","医疗","交通","安平系统二部","公路","联通","安平","财政民生","高教","其他"];
export const projectTypeList = [
  { value: 1, label: '内部组织'},
  { value: 2, label: '云服务'},
  { value: 3, label: '云驻场'}
];
export const projectProgressList = [
  { value: '0', label: '待启动',color: '#18ccc3'},
  { value: '1', label: '交付中' ,color: '#0AD96F'},
  { value: '2', label: '已超期' ,color: '#cc0001'},
  { value: '3', label: '已完成' ,color: '#076fd6'},
  { value: '4', label: '关闭' ,color: '#A4A0A1'},
  { value: '5', label: '其他' ,color: '#df8040'},
];
export default {
  areaList,
  servicePropertyList,
  paySpecList,
  projectTypeList,
  projectProgressList,
  projectTradeList
};
