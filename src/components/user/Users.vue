<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click=" addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="serRole(scope.row)"
              ></el-button>
            </el-tooltip>
            {{scope.id}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 翻页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dsetRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (relu, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb;
      }
      cb(new Error("输入合法的邮箱"));
    };
    var checkMobile = (relu, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb;
      }
      cb(new Error("输入合法的手机号"));
    };
    return {
      // 发送数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 用户数据
      userList: [],
      // 页码
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "3~10", trigger: "blur" }
        ],
        password: [
          { required: true, message: "输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "3~10", trigger: "blur" }
        ],
        email: [
          { required: true, message: "输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 发送请求
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 页码变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新失败");
      }
      this.$message.success("成功");
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    async addUser() {
      // this.$refs.addFormRef.validate(async valid => {
      //   console.log(valid);

      // if (!valid) return
      const { data: res } = await this.$http.post("users", this.addForm);
      if (res.meta.status !== 201) {
        this.$message.error("添加用户失败！");
      }
      this.$message.success("添加用户成功！");
      this.addDialogVisible = false;
      this.getUserList();
      // })
    },
    // 编辑
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async editUserInfo(id) {
      //  this.$refs.editFormRef.validate(async valid=>{
      //     if(!valid) return;
      //     console.log(123);

      const { data: res } = await this.$http.put("users/" + id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      });
      if (res.meta.status !== 200) {
        return this.$message.error("错误");
      }
      this.editDialogVisible = false;
      this.getUserList();
      this.$message.success("成功");
      // })
    },
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      } else {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("失败");
        }
        this.$message.success("删除成功");
        this.getUserList();
      }
    },
    async serRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("失败");
      }
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("选择角色");
      }
      const {
        data: res
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      });
      if (res.meta.status !== 200) {
        return this.$message.error("失败");
      }
      this.$message.success("成功");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    setRoleDialogClosed() {
      this.selectRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>
<style scoped>
</style>  