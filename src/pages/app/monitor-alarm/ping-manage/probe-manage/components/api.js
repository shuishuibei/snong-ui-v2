export const FUNCTION_NAME = '探针节点';
export const LIST_URL = 'probeNode/page/list';
export const ADD_URL = 'probeNode/add';
export const UPDATE_URL = 'probeNode/update';
export const DELETE_URL = 'probeNode/delete';
export const DEPLOY_URL = 'probeNode/deploy';

export const NETWORK_AREA = [
  {
    value: '',
    label: '请选择'
  },
  {
    value: 'hlw',
    label: '互联网区'
  },
  {
    value: 'zww',
    label: '政务网区'
  }
];
export const PING_OBJECTS = [
  {
    value: 'manage',
    label: '管理网'
  },
  {
    value: 'biz',
    label: '业务网'
  }
];
export const Status = [
  {
    value: 0,
    label: '未部署'
  },
  {
    value: 1,
    label: '已部署'
  }
]
export default {
  FUNCTION_NAME,
  LIST_URL,
  ADD_URL,
  UPDATE_URL,
  DELETE_URL,
  DEPLOY_URL,
  NETWORK_AREA,
  PING_OBJECTS,
  Status
};
