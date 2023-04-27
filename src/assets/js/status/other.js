// 状态：有效/无效
const basicStatus = [
  {
    value: true,
    label: '有效',
    color: '#5ddb50'
  },
  {
    value: false,
    label: '无效',
    color: '#ff0000'
  }
];

// 流程状态
const taskStatus = [
  {
    value: false,
    label: '审批中'
  },
  {
    value: true,
    label: '流程结束'
  },
];

// Power虚拟机运行状态,server.js里放的是状态，此处是运行状态，稍有不同
const moveState = [
  {
    value: 'OK',
    label: '正常'
  },
  {
    value: 'WARNING',
    label: '警告'
  },
  {
    value: 'CRITICAL',
    label: '异常'
  },
  {
    value: 'ATTENTION',
    label: '注意'
  },
  {
    value: 'PENDING',
    label: '暂挂'
  }
];

export {basicStatus, taskStatus, moveState};
