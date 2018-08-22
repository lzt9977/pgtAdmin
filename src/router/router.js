import Main from '@/views/home.vue';


//独立的顶级路由
export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        title: '锁定页面'
    },
    component: (resolve) => require(['@/views/locking/index.vue'], resolve)
};

export const login = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录页面'
    },
    component: (resolve) => require(['@/views/login/login.vue'], resolve)
};




// main的子组件 不显示在slider
export const otherRouter = [{
    path: '/',
    title: '首页',
    redirect: '/home',
    component: Main,
    icon:'ios-navigate',
    children:[
        {
            path: 'home',
            name: 'home-index',
            component: (resolve) => require(['@/views/home/index.vue'], resolve)
        }
    ]
},{
    path: '/goods',
    name: 'addCategory',
    title: '添加分类',
    component: Main,
    icon:'ios-navigate',
    children:[
        {
            path: 'category-add',
            name: 'category-add',
            component: (resolve) => require(['@/views/goods/category-add.vue'], resolve)
        }
    ] 
}]

// main的子组件 显示在slider
export const appRouter = [{
    path: '/access',
    name: 'access',
    title: '权限管理',
    component: Main,
    icon:'ios-navigate',
    children:[
        {
            path: 'index',
            name: 'access-index',
            component: (resolve) => require(['@/views/access/index.vue'], resolve)
        }
    ]
},{
    path: '/goods',
    name: 'goods',
    title: '商品管理',
    component: Main,
    icon:'ios-navigate',
    children:[
        {
            path: 'add',
            name: 'goods-add',
            title: '商品添加',
            icon:'ios-navigate',
            component: (resolve) => require(['@/views/goods/add.vue'], resolve)
        },
        {
            path: 'category',
            name: 'goods-category',
            title: '商品分类',
            icon:'ios-navigate',
            component: (resolve) => require(['@/views/goods/category.vue'], resolve)
        },
        {
            path: 'list',
            name: 'goods-list',
            title: '商品列表',
            icon:'ios-navigate',
            component: (resolve) => require(['@/views/goods/list.vue'], resolve)
        }
    ]
},{
    path: '/article',
    name: 'article',
    title: '文章系统',
    component: Main,
    icon:'ios-navigate',
    children:[
        {
            path: 'list',
            name: 'article-list',
            title: '文章列表',
            icon:'ios-navigate',
            component: (resolve) => require(['@/views/article/list.vue'], resolve)
        },
        {
            path: 'release',
            name: 'article-release',
            title: '文章发布',
            icon:'ios-navigate',
             component: (resolve) => require(['@/views/article/release.vue'], resolve)
        }
    ]
}];


export const routers = [
    login,
    locking,
    ...otherRouter,
    ...appRouter
];