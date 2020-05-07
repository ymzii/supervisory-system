<template>
    <div>
            <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand" prop=">">
                <template slot-scope="scope">
                    <el-row :class="['vcenter','bdbottom',i1===0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key = item1.id>
                       <!-- 一级权限 -->
                        <el-col :span="5">
                           <el-tag @close='removeRights(scope.row,item1.id)' > {{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级权限 -->
                        <el-col :span="19">
                            <el-row :class="['vcenter',i2 === 0 ? '':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" @close='removeRights(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18" >
                                    <el-tag type="warning"  v-for="(item3,i3) in item2.children" :key="i3" closable @close='removeRights(scope.row,item3.id)'>
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>

                        </el-col>
                    </el-row>
                   <pre> 
                        {{scope.role}}
                   </pre>
                </template>
            </el-table-column>

            <el-table-column type="index" prop="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">

                     <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                     <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                     <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="30%"
  @close="setRightDialogClosed"
  >
  <!-- 树形控件 -->
  <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 数据
            rolelist:[],
            // 分配权限
            setRightDialogVisible:false,
            rightList:[],
            // 树形控件
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认选定的 
           defkeys:[],
           roleId:''

        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        // 获取数据
        async getRolesList(){
            const {data:res} =  await this.$http.get('roles')
            if(res.meta.status !==200){
                return this.$message.error('失败')
            }
            this. rolelist = res.data
        },
        // 删除权限
        async removeRights(role,rightId){
           const confirmResult =   await this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(confirmResult !== 'confirm'){
            return this.$message.info('取消删除')
        }
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if(res.meta.status !==200){
              this.$message.error('失败')
          }
          role.children = res.data
        },
        // 分配权限
        async showSetRightDialog(role){ 
            this.roleId = role.id
            // 获取数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !==200){
                this.$message.error('获取失败')
            }
            this.rightList = res.data
            console.log( this.rightList);     
             this.getLeafkeys(role,this.defkeys)      
            this.setRightDialogVisible = true
        },
        getLeafkeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getLeafkeys(item,arr)
            })
        },
        setRightDialogClosed(){
            this.defkeys = []
        },
        // 分配权限
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !==200){
                return this.$message.error('失败')
            }
            this.$message.success('成功')
            this.getRolesList()
            this.setRightDialogVisible = false
        } 
    }
}
</script>
<style scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style> 