<template>
    <Header :style="{position: 'fixed', width: '100%', zIndex: '12'}">
        <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo"><img src="https://pgt-activity.oss-cn-hangzhou.aliyuncs.com/newPc/pgt_03.png" alt=""></div>
            <div class="layout-nav">
                <MenuItem name="1">
                    <Icon type="ios-navigate"></Icon>
                    系统
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="ios-keypad"></Icon>
                    商城
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="ios-paper"></Icon>
                    文章
                </MenuItem>
            </div>
            <div class="userInfo">
                <span>{{ userInfo.nickname }}</span>
                <span>{{ userInfo.mobile }}</span>
                <img :src="userInfo.headimg" alt="" class="headImg">
            </div>
        </Menu>
    </Header>
</template>
<script>
    import util from "../libs/util.js";
    export default {
        data () {
            return {
                tableData:[],
                number:0,
                userInfo: {

                }
            }
        },
        created () {
            this.getData();
        },
        methods: {
            getData () {
                util
                .post("/user/getUserInfo", {})
                .then(res => {
                    this.userInfo = res.data.data
                })
            }
        }
    }
</script>
<style scoped>
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-logo img{
    width:70px;
    display: block
}
.layout-nav{
    float: left;
    margin-left: 80px;
}
.userInfo{
    color:#fff;
    float: right;
    font-size:16px;
    line-height:60px;
}
.userInfo span{
    display: block;
    float:left;
    margin-right:10px;
}
.userInfo .headImg{
    width:50px;
    height:50px;
    display: block;
    float:left;
    margin:7px 10px 0 0;
}
</style>