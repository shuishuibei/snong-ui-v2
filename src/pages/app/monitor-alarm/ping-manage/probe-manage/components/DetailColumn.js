import {NETWORK_AREA,PING_OBJECTS} from './api'
export const DetailRow = [
  {
    title: '探针名称',
    key: 'pingNodeName'
  },
  {
    title: '所属项目',
    key: 'projectName'
  },
  {
    title: '区域',
    key: 'region',
    render: (h, params) => {
      let region = params.row.region;
      if (region) {
        let node = NETWORK_AREA.filter((item) => {
          return item.value === region
        })[0];
        return h('div', [
          h('span', {
          }, node.label)
        ])
      }
    }
  },
  {
    title: '拨测对象',
    key: 'pingObject',
    render: (h, params) => {
      let pingObject = params.row.pingObject;
      if (pingObject) {
        let node = PING_OBJECTS.filter((item) => {
          return item.value === pingObject
        })[0];
        return h('div', [
          h('span', {
          }, node.label)
        ])
      }
    }
  },
  {
    title: '探针IP',
    key: 'pingIp'
  },
  {
    title: '探针公网IP',
    key: 'pingPublicIp'
  },
  {
    title: '部署状态',
    key: 'probeStatus',
    render: (h, params) => {
      let node = params.row.probeStatus,
        text = node === 1 ? '已部署' : '未部署',
        color = node === 1 ? '#145db7' : '#dfce20';
      return h('div', [
        h('span', {
          class: 'cds-status-dot',
          style: {
            backgroundColor: color
          }
        }),
        h('span', {
          style: {
            verticalAlign: 'middle',
            color: color
          }
        }, text)
      ])
    }
  },
  {
    title: '所属地区',
    key: 'area'
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, params) => {
      let time = params.row.createTime
      if (time) {
        time = time.replace(/T/g, ' ')
      }
      return h('span', {
        attrs: {
          title:time
        }
      }, time);
    }
  },
  {
    title: '创建人',
    key: 'createBy'
  },
]

