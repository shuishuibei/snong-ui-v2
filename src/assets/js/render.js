/*
 * @Descripttion:
 * @Author: z12956
 * @Date: 2019-10-28 11:58:10
 * @LastEditors: z12956
 * @LastEditTime: 2019-10-28 14:15:25
 */

/**
 * @name: 状态单元格的render函数
 * @param {function} h
 * @param {object} params 包含row、column和index，分别指当前行数据，当前列数据，当前行索引
 * @param {array} statusArr 状态全集数组
 * @return
 */
export const statusCellRender = (h, params, statusArr) => {
  let title = params.row[params.column.key];

  let label = '未知状态',
    color = '#ffa904';
  
  let arr = statusArr ? statusArr : params.column.filters;
  let node = arr.filter(item => {
    if (typeof title === 'string') {
      return item.value.toLowerCase() === title.toLowerCase();
    } else {
      return item.value === title;
    }
  });

  if (node.length > 0) {
    label = node[0].label;
    color = node[0].color;
  }

  return h(
    'div',
    {
      class: 'ivu-table-cell-ellipsis',
      style: {
        color: color
      },
      attrs: {title: label}
    },
    [
      h('div', {
        class: 'cds-status-dot ',
        style: {
          backgroundColor: color
        }
      }),
      h(
        'span',
        {
          style: {
            'vertical-align': 'middle'
          }
        },
        label
      )
    ]
  );
};

/**
 * @name: title单元格的render函数
 * @param {function} h
 * @param {object} 包含row、column和index，分别指当前行数据，当前列数据，当前行索引
 * @return:
 */
export const titleCellRender = (h, params) => {
  let title = params.row[params.column.key];
  return h(
    'span',
    {
      attrs: {
        title: title
      }
    },
    title
  );
};

export const activeCellRender = (h, params, key, callback) => {
  return h(
    'span',
    {
      attrs: {
        title: params.row[key]
      },
      class: ['cell-info-active'],
      on: {
        click: callback
      }
    },
    params.row[key]
  );
};
