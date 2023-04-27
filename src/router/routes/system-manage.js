/**
 * @file 系统管理路由
 * @author zhaoyanan<zhao.yanan@h3c.com>
 */
import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';

export default {
    name: 'system-manage',   //一级菜单：系统管理
    path: '/system-manage',
    component: Main,
    //输入的路径不完整,跳转到子菜单的第一个资源池管理
    redirect: {
        name: 'resource-pool-manage'
    },
    children: [
        {
            name: 'system-config',
            path: 'system-config',
            component: H3cLayout,
            redirect: {
                name: 'resource-pool-manage'
            },
            children: [
                {
                    name: 'project-management',
                    path: 'project-management',
                    component: () =>
                        import('@/pages/app/system-manage/project-management/ProjectManagement'),
                },
                {
                    name: 'user-manage',  //用户管理
                    path: 'user-manage',
                    component: () =>
                        import('@/pages/app/system-manage/user-manage/UserManage.vue')
                },
                {
                    name: 'role-manage',  //角色管理
                    path: 'role-manage',
                    component: () =>
                        import('@/pages/app/system-manage/role-manage/RoleManage.vue')
                },
                {
                    name: 'connection-config',  //连接配置
                    path: 'connection-config',
                    component: () =>
                        import('@/pages/app/system-manage/connection-config/ConnectionConfig.vue')
                },
                {
                    name: 'timed-task',   //定时任务
                    path: 'timed-task',
                    component: () =>
                        import('@/pages/app/system-manage/timed-task/TimedTask.vue')
                },
                {
                    name: 'resource-manage',  //资源管理
                    path: 'resource-manage',
                    component: () =>
                        import('@/pages/app/system-manage/resource-manage/ResourceManage.vue'),
                },
                {
                    name: 'api-manage',   //API管理
                    path: 'api-manage',
                    component: () =>
                        import( /*webpackChunkName: "api-manage"*/ '@/pages/app/system-manage/api-manage/ApiManage.vue')
                },
            ]
        },
        {
          name: 'parameter-config',
          path: 'parameter-config',
          redirect: {
            name: 'system-parameter'
          },
          component: H3cLayout,
          children: [
            {
              name: 'system-parameter',
              path: 'system-parameter',
              component: () =>
                import( /*webpackChunkName: "system-parameter"*/ '@/pages/app/system-manage/parameter-config/system-parameter/SystemParameter.vue')
            },
            {
              name: 'other-config',
              path: 'other-config',
              component: () =>
                import( /*webpackChunkName: "other-config"*/ '@/pages/app/system-manage/parameter-config/other-config/OtherConfig.vue')
            }
          ]
        },
        {
          name: 'code',
          path: 'code',
          redirect: {
            name: 'code-generator'
          },
          component: H3cLayout,
          children: [
            {
              name: 'code-generator',
              path: 'code-generator',
              component: () => import('@/pages/app/system-manage/code/Code')
            }
          ]
        }
        // {
        //     name: 'group-manage',   //二级菜单：组织管理
        //     path: 'group-manage',
        //     component: H3cLayout,
        //     redirect: {
        //         name: 'group-manage/index'
        //     },
        //     children: [
        //         {
        //             // 组织主页
        //             name: 'group-manage/index',
        //             path: 'index',
        //             meta: {
        //                 keepAlive: true
        //             },
        //             component: () => import( /*webpackChunkName: "group-manage"*/ '@/pages/app/system-manage/group-manage/GroupManage.vue')
        //         },
        //         {
        //             // 组织新增（资源池）
        //             name: 'group-manage/edit',
        //             path: 'edit',
        //             meta: {
        //                 breadcrumb: '组织编辑'
        //             },
        //             component: () => import( /*webpackChunkName: "group-pool-edit"*/ '@/pages/app/system-manage/group-manage/components/GroupPoolEdit.vue')
        //         }
        //     ]
        // },
    ]
};
