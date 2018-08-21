<template>
    <Layout class="goods views">
        <table class="add-Category">
            <tr>
                <td width="100" class="ileft">
                    分类名称:
                </td>
                <td>
                    <Input v-model="categoryName" placeholder="Enter something..." style="width: 300px" />
                </td>
            </tr>
            <tr>
                <td class="ileft">
                    上级分类ID:
                </td>
                <td>
                    <Cascader :data="category" v-model="categoryArr" change-on-select @on-change="getCascader" class="category" style="width: 300px"></Cascader>
                </td>
            </tr>
            <tr>
                <td class="ileft">
                    分类图标:
                </td>
                <td>
                    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="item.id">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                        accept=".jpg,.jpeg,.png"
                        ref="upload"
                        :show-upload-list="false"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="1024"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        action="http://118.24.33.215:8888/images/upload"
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible">
                        <img :src="imgName" v-if="visible" style="width: 100%">
                    </Modal>
                    
                </td>
            </tr>
            <tr>
                <td class="ileft">
                    排序:
                </td>
                <td>
                    <Input v-model="sort" placeholder="Enter something..." style="width: 300px" />
                </td>
            </tr>
            <tr>
                <td class="ileft"></td>
                <td>
                    <Button type="primary" @click="submit">确认提交</Button>
                </td>
            </tr>
        </table>
    </Layout>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
      categoryName: "",
      categoryParentId: "",
      sort: "",
      files: [],
      src: [],
      imgName: "",
      visible: false,
      uploadList: [],
      categoryArr: [],
      category: [],
      searchCategory: null
    };
  },
  mounted() {

    util
      .post("/goods/listCategory", {})
      .then(res => {
        if (res.data.code == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].label = res.data.data[i].cat_name;
            res.data.data[i].value = res.data.data[i].cat_id;
            for (let j = 0; j < res.data.data[i].children.length; j++) {
              res.data.data[i].children[j].label =
                res.data.data[i].children[j].cat_name;
              res.data.data[i].children[j].value =
                res.data.data[i].children[j].cat_id;

                delete res.data.data[i].children[j].children 
                
            }
          }
          this.category = res.data.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleRemove(i) {
      this.uploadList.splice(i, 1);
    },
    handleSuccess(res, file) {
      console.log(res);
      this.uploadList.push({
        name: "",
        status: "finished",
        url: res.data
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: file.name + "这张图片超过了1M 不允许上传"
      });
    },

    handleBeforeUpload(file) {
      // 数量判断
      const check = this.uploadList.length <= 1;

      if (!check) {
        this.$Notice.warning({
          title: "您所选的图片数量超过了最大数量"
        });
      }

      return check;
    },
    getCascader(value, selectedData) {
      this.searchCategory = selectedData[selectedData.length - 1];
    },
    submit() {

        util
        .post("/goods/addCategory", {
            cat_name: this.categoryName,
            cat_sort: this.sort,
            cat_level: ++this.searchCategory.cat_level,
            parent_id: this.searchCategory.cat_id,
            cat_image: this.uploadList[0]?this.uploadList[0].url:null
        })
        .then(res => {
            if(res.data.code == 0){
                this.$Message.success(res.data.msg);
                this.categoryName = ''
                this.sort = ''
                this.searchCategory = null
                this.uploadList = []
                this.categoryArr = []
            }else{
                this.$Message.success('添加失败，请刷新重试');
            }
        })


    }
  }
};
</script>
<style>
.add-Category {
  margin: 30px auto 0;
  width: 600px;
}
.add-Category tr td {
  padding-bottom: 20px;
}
.add-Category tr td:first-child {
  text-align: right;
  padding-right: 10px;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.ileft {
  vertical-align: 0px;
  line-height: 35px;
}
</style>
