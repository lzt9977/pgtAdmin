<template>
    <Layout class="goods views">

        <div class="addCategory">
            <span class="title">商品分类列表 ( 共 {{ number }} 条记录 )</span>
            <Button to="./category-add" size="large" type="primary" class="tos" icon="ios-add-circle-outline">新增商品分类</Button>
        </div>

        <table class="category-table" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="300">分类名称</th>
                    <th>商品数量</th>
                    <th>分类图标</th>
                    <th>排序</th>
                    <th>是否显示</th>
                    <th width="400">操作</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(i,index) in tableData">

                    <tr :key="index" :data-catId="i.cat_id" :data-level="i.cat_level" :data-parentId="i.parent_id" v-if="i.cat_level==1 && i.show" class="level1">
                        <td @click="open(i)"><span v-if="i.children.length>0"> > </span>{{ i.cat_name }}</td>
                        <td>{{ i.cateLen }}</td>
                        <td><img :src="i.cat_image" alt="" width="50" height="50"></td>
                        <td>{{ i.cat_sort }}</td>
                        <td> <Switch v-model="i.is_show" @on-change="change(i)" /> </td>
                        <td>
                            <Button type="info">编辑</Button>
                            <Button type="success">新增下级分类</Button>
                            <Button type="error">删除</Button>
                        </td>
                    </tr>
                   
                    <tr :key="index" :data-catId="i.cat_id" :data-level="i.cat_level" :data-parentId="i.parent_id" v-if="i.cat_level==2 && i.show" class="level2">
                        <td @click="open(i)"><span v-if="i.children && i.children.length>0"> > </span>{{ i.cat_name }}</td>
                        <td>{{ i.cateLen }}</td>
                        <td><img :src="i.cat_image" alt="" width="50" height="50"></td>
                        <td>{{ i.cat_sort }}</td>
                        <td> <Switch v-model="i.is_show" @on-change="change(i)" /> </td>
                        <td>
                            <Button type="info">编辑</Button>
                            <Button type="warning">转移分类</Button>
                            <Button type="success">新增下级分类</Button>
                            <Button type="error">删除</Button>
                        </td>
                    </tr>

                    <tr :key="index" :data-catId="i.cat_id" :data-level="i.cat_level" :data-parentId="i.parent_id" v-if="i.cat_level==3 && i.show" class="level3">
                        <td>{{ i.cat_name }}</td>
                        <td>{{ i.cateLen }}</td>
                        <td><img :src="i.cat_image" alt="" width="50" height="50"></td>
                        <td>{{ i.cat_sort }}</td>
                        <td> <Switch v-model="i.is_show" @on-change="change(i)" /> </td>
                        <td>
                            <Button type="info">编辑</Button>
                            <Button type="warning">转移分类</Button>
                            <Button type="error">删除</Button>
                        </td>
                    </tr>

                </template>
            </tbody>
        </table>
    </Layout>
</template>
<script>
    import util from "../../libs/util.js";
    export default {
        data () {
            return {
                tableData:[],
                number:0
            }
        },
        created () {
            this.getData();
        },
        methods: {
            getData () {
                util
                .post("/goods/category", {})
                .then(res => {
                    if (res.data.code == 0) {
                        let result = res.data.data
                        let idx = 0
                        this.tableData = []
                        for(let i=0;i<result.length;i++){
                            result[i].show = true
                            result[i].index = idx
                            idx++
                            result[i].is_show == 1 ? result[i].is_show = true : result[i].is_show = false
                            this.tableData.push(result[i])

                            for(let j=0;j<result[i].children.length;j++){

                                result[i].children[j].index = idx
                                idx++
                                result[i].children[j].show = false
                                result[i].children[j].is_show == 1 ? result[i].children[j].is_show = true : result[i].children[j].is_show = false
                                this.tableData.push(result[i].children[j])
                                
                                for(let l=0;l<result[i].children[j].children.length;l++){
                                    
                                    result[i].children[j].children[l].index = idx
                                    idx++

                                    result[i].children[j].children[l].show = false
                                    result[i].children[j].children[l].is_show == 1 ? result[i].children[j].children[l].is_show = true : result[i].children[j].children[l].is_show = false
                                    this.tableData.push(result[i].children[j].children[l])
                                }
                            }
                        }

                        this.number = this.tableData.length

                    }
                })
                .catch(err => {
                    console.log(err);
                });
            },
            open (item) {
                for(let i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].parent_id == item.cat_id){
                        if(!this.tableData[i].show){
                            this.tableData[i].show = true
                            this.$set(this.tableData,i,this.tableData[i])
                        }else{
                            this.tableData[i].show = false
                            this.$set(this.tableData,i,this.tableData[i])

                            if(this.tableData[i].children){
                                for(let j=0;j<this.tableData[i].children.length;j++){
                                    let idx = this.tableData[i].children[j].index
                                    this.tableData[idx].show = false
                                    this.$set(this.tableData,idx,this.tableData[idx])
                                }
                            }
                            
                        }
                    }
                }
            },
            change (i) {
                let catId = []
                let status = i.is_show

                catId.push(i.cat_id)
                if(i.children){
                    for(let j=0;j<i.children.length;j++){
                        catId.push(i.children[j].cat_id)
                        if(i.children[j].children){
                            for(let l=0;l<i.children[j].children.length;l++){
                                catId.push(i.children[j].children[l].cat_id)
                            }
                        }
                    }
                }
                
                util
                .post("/goods/categoryIsShow", {
                    catId: catId.join(','),
                    status: status
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.$Message.success(res.data.msg);
                        for(let i=0;i<this.tableData.length;i++){
                            for(let j=0;j<catId.length;j++){
                                if(this.tableData[i].cat_id == catId[j]){
                                    this.tableData[i].is_show = status
                                }
                            }
                        }
                    }
                })
                
            }
        }
    }
</script>
<style>
.category-table{
    margin-top:15px;
    background:#fff;
    border-collapse: collapse;
    text-align: center
}
.category-table thead th{
    text-align: center;
    line-height:40px;
    background:rgb(249, 249, 249);
}

.category-table td,.category-table th{
    border:1px solid #eee;
}
.category-table td{
    height:50px;
}
.level1 td:first-child{
    padding-left:20px;
    text-align: left
}
.level2 td:first-child{
    padding-left:50px;
    text-align: left
}
.level3 td:first-child{
    padding-left:80px;
    text-align: left
}
.ivu-switch-checked{
    border-color:#6DD26A !important;
    background:#6DD26A !important
}
.addCategory{
    padding-top:20px;
}
.addCategory .title{
    padding-top:10px;
    font-size:16px;
    display: inline-block;
}
.addCategory .tos{
    width:140px;
    float:right;
}
.ivu-icon-ios-add:before {
    font-size: 20px !important;
}
</style>
