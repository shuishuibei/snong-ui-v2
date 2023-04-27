//开发配置
import Main from '@/pages/main/Main.vue';

export default {
  name: 'dev-config',
  path: '/dev-config',
  component: Main,
  redirect: {
    name: 'dev-template'
  },
  children: [
    {
      name: 'dev-template',   //开发模板
      path: 'dev-template',
      component: () =>
        import ( /*webpackChunkName: "DevTemplate"*/ '@/pages/app/dev-config/dev-template/DevTemplate.vue')
    },
    {
      name: 'dev-template-v2',   //开发模板
      path: 'dev-template-v2',
      component: () =>
        import ( /*webpackChunkName: "DevTemplateV2"*/ '@/pages/app/dev-config/dev-template-v2/DevTemplateV2.vue')
    }
  ]
}
