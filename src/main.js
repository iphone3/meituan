// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Axios from 'Axios'

// 1、导入组件
import Goods from "components/Goods/Goods"
import Ratings from "components/Ratings/Ratings"
import Seller from "components/Seller/Seller"


Vue.config.productionTip = false

// 安装vue-router插件
Vue.use(VueRouter);
// 如果在其他组件中使用axios命令，需要改写为Vue原型属性
Vue.prototype.$axios = Axios;


// 2、定义路由
const routes = [
	{
		path: '/',
		// 重定向
		redirect: '/goods'	// '/' ==> '/goods'
	},
	{
		path:'/goods',
		component: Goods
	},
	{
		path:'/ratings',
		component: Ratings
	},
	{
		path:'/seller',
		component: Seller
	}
];

// 3. 创建 router 实例
const router = new VueRouter({
	routes,
	// 选中后的类名 (默认值是router-link-active)
	linkActiveClass: 'active'
})


/* eslint-disable no-new */
new Vue({
  el: '#app',	
  template: '<App/>',
  components: { App },
  // 4. 创建和挂载根实例
  router
})
