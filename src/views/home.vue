<template>
    <Layout>
        <Header></Header> 
        <Layout>
            <Sider></Sider>
            <router-view></router-view>
        </Layout>
    </Layout>
</template>
<script>
    import Header from '../components/header';
    import Sider from '../components/sider';
    import util from "../libs/util.js";
    export default {
        components:{
            Header,
            Sider
        },
        data() {
            return {

            };
        },
        mounted() {
            // util.post("http://localhost:8888/user",{
            //     phone: '18201035129'
            // })
            // .then(res => {
            //     console.log(res.data)
            // })
            // .catch(err => {
            //     console.log(err)
            // });
        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>
<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.ivu-layout-header{
    padding:0
}
</style>