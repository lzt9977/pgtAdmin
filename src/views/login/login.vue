<template>
    <div class="login">
        <div class="login-box">
            <h2>登录</h2>   
            <Input v-model="a" placeholder="phone..." style="width: 300px" autocomplete="off"/>
            <Input v-model="b" autocomplete="off" placeholder="password..." style="width: 300px" />
            <Button type="primary" class="login-btn" @click="submit">登录</Button>
        </div>
    </div>
</template>
<script>
import util from "../../libs/util.js";
export default {
    data () {
        return {
            a: null,
            b: null
        }
    },
    methods: {
        submit () {
            util
            .post("/login", {
                phone: this.a,
                password: this.b
            })
            .then(res => {

                    console.log(res.data)
                if (res.data.code == 0) {
                    localStorage.setItem('token',res.data.data.token)
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}
</script>
<style>
.login{
    width:100%;
    height:100%;
    background:url(../../assets/images/login-bg.jpg);
    background-size: cover
}
.login-box{
    border-radius: 15px;
    width:380px;
    height:380px;
    background: rgba(255,255,255,1);
    transform: translate(-50%, -50%);
    position: relative;
    left: 50%;
    top: 40%;
}
.login-box{
    text-align: center;
    line-height:50px;
    font-size:16px;
}
.login-btn{
    width:300px;
    margin:0 auto;
    height:40px;
    line-height:40px;
    margin-top:20px;
}
</style>