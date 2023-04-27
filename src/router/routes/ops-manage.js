import Main from '@/pages/main/Main.vue';
// 监控告警
export default {
    name: 'ops-manage',
    path: '/ops-manage',
    component: Main,
    redirect: {
        name: 'assets-manage'
    },
    children: [
        {
            name: 'assets-manage',
            path: 'assets-manage',
            redirect: {
                name: 'host-assets'
            },
            component: () => import('@/pages/app/assets-manage/AssetsManage.vue'),
            children: [
                {
                    name: 'host-assets', //主机资产
                    path: 'host-assets',
                    component: () =>
                        import( /*webpackChunkName: "host-assets"*/ '@/pages/app/assets-manage/host-assets/HostAssets.vue')
                },
                {
                    name: 'network-assets', //网络设备
                    path: 'network-assets',
                    component: () =>
                        import( /*webpackChunkName: "network-assets"*/ '@/pages/app/assets-manage/network-assets/NetworkAssets.vue')
                },
                {
                    name: 'storage-assets', //存储设备
                    path: 'storage-assets',
                    component: () =>
                        import( /*webpackChunkName: "storage-assets"*/ '@/pages/app/assets-manage/storage-assets/StorageAssets.vue')
                }
            ]
        },
        {
            name: 'project-inspection',   //二级菜单：项目巡检
            path: 'project-inspection',
            component: () => import('@/pages/app/project-inspection/ProjectInspection.vue'),
            //输入的路径不完整,跳转到子菜单的第一个资源池管理
            redirect: {
                name: 'inspection-report'
            },
            children: [
                {
                    name: 'capacity-report',  //容量报告
                    path: 'capacity-report',
                    component: () => import('@/pages/app/capacity-manage/capacity-report/CapacityReport.vue')
                },

                {
                    name: 'inspection-product',  //产品巡检
                    path: 'inspection-product',
                    component: () => import('@/pages/app/project-inspection/inspection-product/InspectionProduct.vue')
                },
                {
                    name: 'inspection-report',  // 巡检报告
                    path: 'inspection-report',
                    component: () => import('@/pages/app/project-inspection/inspection-report/InspectionReport.vue')
                }
            ]
        },
        {
            name: 'ops-control',
            path: 'ops-control',
            redirect: {
                name: 'resource-assign'
            },
            component: () => import('@/pages/app/ops-control/OpsControl.vue'),
            children: [
                {
                    name: 'resource-assign', //资源分配
                    path: 'resource-assign',
                    component: () =>
                        import('@/pages/app/ops-control/resource-assign/ResourceAssign.vue')
                },
                {
                  name: 'remote-control', //远程控制
                  path: 'remote-control',
                  component: () =>
                    import('@/pages/app/ops-control/remote-control/RemoteControl.vue')
                },
                {
                  name: 'audit', //审计回放
                  path: 'audit',
                  component: () =>
                    import('@/pages/app/ops-control/audit/Audit.vue')
                }
            ]
        },
        {
            name: 'soft-risk',
            path: 'soft-risk',
            component: () => import('@/pages/app/soft-risk/SoftRisk.vue'),
            redirect: {
                name: 'task-manage'
            },
            children: [
                {
                    name: 'task-manage', //技术任务管理
                    path: 'task-manage',
                    component: () =>
                        import('@/pages/app/ops-manage/task-manage/TaskManage.vue')
                },
                {
                    name: 'task-check',   //技术任务排查
                    path: 'task-check',
                    component: () =>
                        import ('@/pages/app/ops-manage/task-manage/TaskCheck.vue')
                }
            ]
        }
    ]
};
