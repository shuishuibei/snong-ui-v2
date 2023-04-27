/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-07-22 16:46:43
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-03 15:53:51
 */
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';
//流程管理
export default {
  name: 'process-manage', // 一级目录
  path: '/process-manage',
  component: Main,
  redirect: {
    name: 'todo-process'
  },
  children: [{
      name: 'todo-process',
      path: 'todo-process',
      component: H3cLayout,
      redirect: {
        name: 'todo-process/index'
      },
      children: [{
          name: 'todo-process/index',
          path: 'index',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: () =>
            import( /*webpackChunkName: "todo-process"*/ '@/pages/app/process-manage/todo-process/TodoProcess.vue'),
        },
        {
          name: 'todo-process/details',
          path: 'index/:id',
          meta: {
            breadcrumb: '流程详情'
          },
          props: ({
            params
          }) => ({
            orderId: params.id
          }),
          component: () =>
            import( /*webpackChunkName: "todo-process-details"*/ '@/pages/app/process-manage/todo-process/page/TodoProcessDetail.vue'),
        }
      ]
    },
    {
      name: 'have-done-process',
      path: 'have-done-process',
      component: H3cLayout,
      redirect: {
        name: 'have-done-process/index'
      },
      children: [{
          name: 'have-done-process/index',
          path: 'index',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: () =>
            import( /*webpackChunkName: "have-done-process"*/ '@/pages/app/process-manage/have-done-process/HaveDoneProcess.vue'),
        },
        {
          name: 'have-done-process/details',
          path: 'index/:id',
          meta: {
            breadcrumb: '流程详情'
          },
          props: ({
            params
          }) => ({
            orderId: params.id
          }),
          component: () =>
            import( /*webpackChunkName: "have-done-process-details"*/ '@/pages/app/process-manage/have-done-process/page/HaveDoneDetail.vue'),
        }
      ]
    },
    {
      name: 'process-template',
      path: 'process-template',
      component: () =>
        import( /*webpackChunkName: "ProcessTemplate"*/ '@/pages/app//process-manage/process-template/ProcessTemplate.vue')
    }
  ]
};
