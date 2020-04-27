const groupRouter = {
    route: null,
    name: null,
    title: '分组管理',
    type: 'folder',
    icon: 'el-icon-menu',
    filePath: 'views/group/',
    order: null,
    inNav: true,
    children: [
      {
        title: '分组列表',
        type: 'view',
        name: 'group-list',
        route: '/group/list',
        filePath: 'views/group/group-list.vue',
        inNav: true,
        icon: ''
      },
      {
        title: '新增分组',
        type: 'view',
        name: 'group-info',
        route: '/group/add',
        filePath: 'views/group/group-info.vue',
        inNav: true,
        icon: ''
      },
    ]
  }
  
  export default groupRouter
  