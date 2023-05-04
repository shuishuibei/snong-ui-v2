import Main from '@/pages/main/Main.vue';
import H3cLayout from '@/components/h3c-layout/H3cLayout.vue';
//个人汇报
export default {
    name: 'report',
    path: '/report',
    component: Main,
    redirect: {
      name: 'project-report'
    },
    children: [
      { // 项目汇报
        name: 'project-report',
        path: 'project-report',
        component: H3cLayout,
        redirect: {
          name: 'project-work'
        },
        children: [
          {
            name: 'project-work', // 项目工作
            path: 'project-work',
            component: () =>
              import( /*webpackChunkName: "project-work"*/ '@/pages/app/personal-report/project-work/ProjectWork.vue')
          },
        ]
      },
      {
        name: 'personal-report',
        path: 'personal-report',
        component: H3cLayout,
        redirect: {
            name: 'work-report'
        },
        children: [
          {
            name: 'work-report',
            path: 'work-report',
            component: () =>
              import( /*webpackChunkName: "work-report"*/ '@/pages/app/personal-report/work-report/WorkReport.vue')
          },
          {
              name: 'daily-report',
              path: 'daily-report',
              component: () =>
                  import( /*webpackChunkName: "daily-report"*/ '@/pages/app/personal-report/daily-report/DailyReport.vue'),
          },
          {
              name: 'weekly-report',
              path: 'weekly-report',
              component: () =>
                  import( /*webpackChunkName: "weekly-report"*/ '@/pages/app/personal-report/weekly-report/WeeklyReport.vue')
          }
        ]
    }]
};
