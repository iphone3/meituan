<template>
	<div class="goods">
		<!--分类列表-->
		<div class="menu-wrapper" ref="menuScroll">
			<ul>
				<!-- 专场-->
				<li class="menu-item" :class="{'current':currentIndex===0}" @click="selectMenu(0)">
					<p class="text">
						<img :src="container.tag_icon" v-if="container.tag_icon" class="icon" />
						{{container.tag_name}}
					</p>
				</li>
				
				
				<li class="menu-item" v-for="(item,index) in goods" :class="{'current':currentIndex===index+1}" @click="selectMenu(index+1)">
					<p class="text">
						<img :src="item.icon" v-if="item.icon" class="icon" />
						{{item.name}}
					</p>
					
					<i class="num" v-show="calculateCount(item.spus)">{{calculateCount(item.spus)}}</i>
				</li>
			</ul>
		</div>

		<!--商品列表-->
		<div class="foods-wrapper" ref="foodScroll">
			<ul>
				<!--专场-->
				<li class="container-list food-list-hook">
					<div v-for="item in container.operation_source_list">
						<img :src="item.pic_url" />
					</div>
				</li>
				
				<!-- 具体分类-->
				<li v-for="item in goods" class="food-list food-list-hook">
					<h3 class="title">{{item.name}}</h3>
					<!--具体商品列表-->
					<ul>
						<li v-for="food in item.spus" class="food-item" @click="showDetail(food)">
							<div class="icon" :style="head_bg(food.picture)" ></div>
							
							<div class="content">
								<h3 class="name">{{food.name}}</h3>
								<p class="desc" v-if="food.description">{{food.description}}</p>
								<div class="extra">
									<span class="saled">{{food.month_saled_content}}</span>
									<span class="praise">{{food.praise_content}}</span>
								</div>
								<img class="product" :src="food.product_label_picture" v-show="food.product_label_picture" />
								<p class="price">
									<span class="text">￥{{food.min_price}}</span>
									<span class="unit">/{{food.unit}}</span>
								</p>
							</div>
							
							<div class="cartcontrol-wrapper">
								<Cartcontrol :food='food'></Cartcontrol>
							</div>
						</li>
					</ul>
					
				</li>
			</ul>
		</div>
	
		<!--购物车-->
		<Shopcart :poiInfo='poiInfo' :selectFoods='selectFoods'></Shopcart>
	
		<!--商品详情-->
		<Food :food='selectedFood' ref='foodView'></Food>
	</div>
</template>

<script>
	// 导入BScroll
	import BScroll from 'better-scroll'
	// 导入Shopcart
	import Shopcart from 'components/Shopcart/Shopcart'
	// 导入Cartcontrol
	import Cartcontrol from 'components/Cartcontrol/Cartcontrol'
	// 导入Food
	import Food from 'components/Food/Food'
	
	export default {
		data() {
			return {
				container:{},
				goods: [],
				poiInfo: {},
				listHeight:[],
				scrollY: 0,
				menuScroll: {},
				foodScroll: {},
				selectedFood: {}
			}
		},
		created() { // 发起异步请求，获取数据
			var that = this;

			// 通过axios发起get请求
			this.$axios.get('/api/goods')
				.then(function(response) { // 获取到数据
					var dataSource = response.data;
					if(dataSource.code == 0) {
						 that.container = dataSource.data.container_operation_source;
						 that.goods = dataSource.data.food_spu_tags;
						 that.poiInfo = dataSource.data.poi_info;
						 
						 // 调用滚动的初始化方法
						 // that.initScroll();
						 // 开始时，DOM元素没有渲染，即高度是问题
						 // 在获取到数据后，并DOM已经被渲染，表示列表高度是没问题的
						 // nextTick
						 that.$nextTick( ()=>{
						 	// DOM已经更新
						 	that.initScroll();
						 	
						 	// 计算分类区间高度
						 	that.calculateHeight();
						 } );
						 
					}
				})
				.catch(function(error) { // 出错处理
					console.log(error);
				});
		},
		methods: {
			head_bg(imgName){
				return "background-image: url(" + imgName + ");"
			},
			// 滚动的初始化
			initScroll(){
				// ref属性就是用来绑定某个dom元素或某个组件，然后在this.$refs里面
				this.menuScroll = new BScroll(this.$refs.menuScroll, {
					click: true
				});
				this.foodScroll = new BScroll(this.$refs.foodScroll, {
					probeType: 3,
					click: true
				});
				
				// 添加滚动监听事件
				this.foodScroll.on('scroll', (pos) => {
					// console.log(pos.y);
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			calculateHeight() {
				// 通过$refs获取到对应的元素
				let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
				
				// 添加到数组区间
				// 0~216 第一个区间(专场)
				// 217~1342 第二个区间(热销)
				let height = 0;
				this.listHeight.push(height);
				for (let i=0; i<foodlist.length; i++) {
					let item = foodlist[i];
					
					// 累加
					height += item.clientHeight;
					
					this.listHeight.push(height);
				}
				
			},
			selectMenu(index){
				// console.log(index);
				
				let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
				
				// 根据下标，滚动到相对应的元素
				let el = foodlist[index];
				
				// 滚动到对应元素的位置
				this.foodScroll.scrollToElement(el,250);
			},
			calculateCount(spus){
				let count = 0;
				spus.forEach((food)=>{
					if(food.count>0){
						count += food.count;
					}
				});
				
				return count;
			},
			showDetail(food) {
				// 传值
				this.selectedFood = food;
				
				// 显示详情页
				this.$refs.foodView.showView();
			}
		}, 
		computed: {
			currentIndex() {	// 根据右侧滚动位置，确定对应的索引下标
				for (let i=0; i<this.listHeight.length; i++) {
					// 获取商品区间的范围
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					
					// 是否在上述区间中
					if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
						return i;
					}
				}
				
				return 0;
			},
			selectFoods() {
				let foods = [];
				
				this.goods.forEach((good)=>{
					good.spus.forEach((food)=>{
						if(food.count>0){
							foods.push(food);
						}
					});
				});
				
				return foods;
			}
		},
		components: {
			BScroll,
			Shopcart,
			Cartcontrol,
			Food
		}


	}
</script>

<style>
.goods{
	display: flex;
	
	/* 通过该方式确定高度*/
	position: absolute;
	top: 190px;
	bottom: 51px;
	
	overflow: hidden;
	width: 100%;
}

/*
 flex: flex-grow | flex-shrink | flex-basis;
 // flex-grow必选，其余可选
 默认: flex 0 1 auto;
 flex-grow: 定义放大比例，默认是0，如果存在剩余空间，也不放大；
 flex-shrink: 定义缩小比例，默认1，如果空间不足，该项目将会被缩小，flex-shrink属性为0时，其他项目为1，则空间不足时，前者不缩小；
 flex-basis: 定义了在分配多余空间之前，项目占据主轴空间。浏览器根据这个属性，计算占据是否有多余空间。
 			 默认值是auto，即项目的本来大小，设为跟width或height属性值一样，则项目占据固定空间;
 */

.goods .menu-wrapper{
	flex: 0 0 85px;
	background: #f4f4f4;
}
.goods .menu-wrapper .menu-item{
	padding: 16px 23px 15px 10px;
	border-bottom: 1px solid #E4E4E4;
	position: relative;
}
.goods .menu-wrapper .menu-item.current{
	background: white;
	font-weight: bold;
	margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current{
	margin-top: 1px;
}
.goods .menu-wrapper .menu-item .text{
	font-size: 13px;
	color: #333333;
	line-height: 17px;
	vertical-align: middle;
	
	/* 多行显示省略号，使用WebKit的CSS扩展属性，适用方位Webkit浏览器以及移动端*/
	
	/* 用来显示一个块元素显示的文本行数*/
	-webkit-line-clamp: 2;
	/* 必须，将对象作为弹性伸缩盒子模型显示*/
	display: -webkit-box;
	/* 必须，设置或检索伸缩盒子的子元素排列方式*/
	-webkit-box-orient: vertical;
	
	overflow: hidden;
}
.goods .menu-wrapper .menu-item .text .icon{
	width: 15px;
	height: 15px;
	vertical-align: middle;
}
.goods .menu-wrapper .menu-item .num{
	position: absolute;
	right: 5px;
	top: 5px;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	color: white;
	background: red;
	text-align: center;
	font-size: 7px;
	line-height: 13px;
}

.goods .foods-wrapper{
	flex: 1;
	/*background: blue;*/
}


.goods .foods-wrapper .container-list{
	padding: 11px 11px 0 11px;
	border-bottom: 1px solid #E4E4E4;
}
.goods .foods-wrapper .container-list img{
	width: 100%;
	margin-bottom: 11px;
	border-radius: 5px;
}

.goods .foods-wrapper .food-list{
	padding: 11px;
}
.goods .foods-wrapper .food-list .title{
	height: 13px;
	font-size: 13px;
	background: url(btn_yellow_highlighted@2x.png) no-repeat left center;
	background-size: 2px 10px;
	padding-left: 7px;
	margin-bottom: 12px;
}

.goods .foods-wrapper .food-list .food-item{
	display: flex;
	margin-bottom: 25px;
	position: relative;
}
.goods .foods-wrapper .food-list .food-item  .icon{
	flex: 0 0 63px;
	background-position: center;
	background-size: 120% 100%;background-repeat: no-repeat;
	margin-right: 11px;
	height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content{
	flex: 1;
}
.goods .foods-wrapper .food-list .food-item .content .name{
	font-size: 16px;
	line-height: 21px;
	color: #333333;
	margin-bottom: 10px;
	padding-right: 27px;
}
.goods .foods-wrapper .food-list .food-item .content .desc{
	font-size: 10px;
	line-height: 19px;
	color: #bfbfbf;
	margin-bottom: 8px;
	
	/* 超出部分显示省略号*/
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.goods .foods-wrapper .food-list .food-item .content .extra{
	font-size: 10px;
	color: #BFBFBF;
	margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled{
	margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product{
	height: 15px;
	margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price{
	font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text{
	font-size: 14px;
	color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit{
	font-size: 12px;
	color: #BFBFBF;
}

.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper{
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>