/*
 * @Description
 * @Author ys1983/张睿博
 * @Date 2019-08-06 11:03:22
 * @LastEditors ys1983/张睿博
 * @LastEditTime 2019-11-02 20:45:26
 */
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';
export default {

  name: 'order-manage',
  path: '/order-manage',
  component: Main,
  redirect: {
    name: 'my-order'
  },
  children: [{
      name: 'my-order',
      path: 'my-order',
      component: H3cLayout,
      redirect: {
        name: 'my-order/index'
      },
      children: [{
          name: 'my-order/index',
          path: 'index',
          meta: {
            keepAlive: true,
          },
          component: () => import( /*webpackChunkName: "my-order" */ '@/pages/app/order-manage/my-order/MyOrder.vue'),
        },
        {
          name: 'my-order/my-order-details',
          path: 'index/:id',
          meta: {
            breadcrumb: '订单详情'
          },
          props: ({
            params
          }) => ({
            orderId: params.id
          }),
          component: () => import( /*webpackChunkName: "my-order-details" */ '@/pages/app/order-manage/my-order/page/MyOrderDetails.vue')
        }
      ]
    },
    {
      name: 'application-list', // 二级目录：申请清单
      path: 'application-list',
      component: () =>
        import(
          /*webpackChunkName: "shopping-cart"*/
          '@/pages/app/order-manage/application-list/ApplicationList.vue'
        )
    },
    {
      name: 'change-list', // 二级目录：变更清单
      path: 'change-list',
      component: () =>
        import(
          /*webpackChunkName: "change-list" */
          '@/pages/app/order-manage/change-list/ChangeList.vue'
        )
    },
    {
      name: 'unsubscribe-list', // 二级目录：退订清单
      path: 'unsubscribe-list',
      component: () =>
        import(
          /*webpackChunkName: "unsubscribe-list" */
          '@/pages/app/order-manage/unsubscribe-list/UnsubscribeList.vue'
        )
    }
  ]

};
