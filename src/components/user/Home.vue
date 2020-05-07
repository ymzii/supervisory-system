<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../assets/aaa.jpg" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toogleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff"
         active-text-color="#409eff" unique-opened :collapse="isCollapse" 
          :collapse-transition="false" :router="true" :default-active="activePath"
         >
            <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 内容 -->
            <template slot="title">
                <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
             <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
            @click="saveNavState('/' + subItem.path)"
             :key="subItem.id">
                 <template slot="title">
                <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
             </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside> 
      <!-- 主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data(){
        return {
            menuList:[],
             iconsObj:{
                 '125':'iconfont icon-user',
                 '103':'iconfont icon-tijikongjian',
                 '101':'iconfont icon-shangpin',
                 '102':'iconfont icon-danju',
                 '145':'iconfont icon-baobiao'
              },
              // 折叠判断
              isCollapse:false,
              // 激活路径
              activePath:''
        }
    },
    created(){
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    }, 
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取数据
    async getMenuList(){
     const {data:res} = await this.$http.get('menus')
     if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
     this.menuList = res.data
     },
    //  折叠切换
     toogleCollapse(){
         this.isCollapse = !this.isCollapse
     },
    //  保存路径
     saveNavState(activePath){
         window.sessionStorage.setItem('activePath',activePath)
         this.activePath = activePath

     }
  },  
};
</script>


<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  align-items: center;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
}
.el-header img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-container {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>