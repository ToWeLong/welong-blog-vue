const categoryRouter = {
  route: null,
  name: null,
  title: '标签管理',
  type: 'folder',
  icon: 'el-icon-collection-tag',
  filePath: 'views/tag/',
  order: null,
  inNav: true,
  children: [
    {
      title: '添加标签',
      type: 'view',
      name: 'tag',
      route: '/tag/add-tag',
      filePath: 'views/tag/add-tag.vue',
      inNav: true,
      icon: ''
    },
    {
      title: '标签列表',
      type: 'view',
      name: 'tag',
      route: '/tag/manager',
      filePath: 'views/tag/tag-list.vue',
      inNav: true,
      icon: ''
    },
  ]
}

export default categoryRouter
