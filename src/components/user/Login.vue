<template>
    <div class="login_container">
       <div class="login_box">
          <!-- 头像 -->
         <div class="avatat_box">
             <img src="../../assets/logo.jpg" alt="">
         </div>
          <!-- 登录表单 -->
       <el-form ref="loginFormRef" :rules="loginFomRules" :model="loginForm" label-width="0px" class="longin_form">
           <!-- 用户名 -->
        <el-form-item  prop="username">
         <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item  prop="password" >
         <el-input  type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>        
        </el-form-item>
       </el-form>
       </div>      
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 登陆数据
            loginForm:{
                username:'admin',
                password:'123456',
            },
            // 登陆表单规则验证
            loginFomRules:{
                username:[
                    {required:true,message:'输入登录名',trigger:"blur"},
                    {min:3,max:10,message:'长度3~10',trigger:"blur"}
                ],
                password:[
                     {required:true,message:'输入登录密码',trigger:"blur"},
                    {min:3,max:10,message:'长度3~10',trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        // 重置
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        // 登陆
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} =  await this.$http.post('login',this.loginForm)
                if(res.meta.status !==200 )return this.$message.error('登录失败');                
                this.$message.success('登陆成功')  
            window.sessionStorage.setItem('token',res.data.token)    
            this.$router.push('/home')               
          })
        }
    }
}
</script>
<style scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        margin: 0 auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatat_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;     
    }
    .avatat_box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
   .longin_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;

    }
</style>