<template>
    <div class="goods views">
        <div class="class">
            <span style="margin-left:0">条形码:</span><Input v-model="barCode" size="large" placeholder="条形码" value=""/>
            <span>关键字:</span><Input v-model="keyWords" size="large" placeholder="商品id/名称" value=""/>
            <span>店铺:</span><Input v-model="shop" size="large" placeholder="店铺id/名称" value=""/>
            <span>分类:</span><Cascader :data="category" v-model="categoryArr" change-on-select @on-change="getCascader" class="category"></Cascader>
            <Button type="primary" size="large" class="searchBtn" @click="search">搜索</Button>
        </div>

        <div class="goods-main">
            <Table border ref="selection" :columns="columns4" :data="tableData" @on-selection-change="selectChange" v-if="isTable"></Table>
            <div style="margin: 10px 0;overflow: hidden">
                <div style="float: left" class="cz-btn">
                    <!-- <Checkbox :value="allCheck" @click.prevent.native="handleCheckAll">Checkbox</Checkbox> -->
                    <Button type="error" @click="Shelf('down')">下架</Button>
                    <Button type="primary" @click="Shelf('up')">上架</Button>
                    <Button type="success" @click="exports">导出</Button>
                </div>
                <div style="float: right;">
                    <Page :total="total" :page-size="size" show-elevator :current="page" show-total @on-change="changePage"></Page>
                </div>
            </div>
        </div>


        <Modal v-model="modal" width="360" v-if="loadingShow">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>商品#{{  tableData[index].goods_id  }}的SKU列表</span>
            </p>
            <div style="text-align:center">
                一个 table
            </div>
            <div slot="footer"></div>
        </Modal>

        
    </div>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
      isTable: true,
      barCode: null,
      keyWords: null,
      shop: null,
      loadingShow: false,
      index: 0,
      modal: false,
      total: 0,
      size: 10,
      page: 1,
      allCheck: false,
      searchCategory: null,
      categoryArr: [],
      category: [],
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center",
          sortable: true
        },
        {
          title: "编号",
          key: "goods_id",
          align: "center",
          sortable: true,
          width: 80
        },
        {
          title: "商品名称",
          key: "goods_name",
          align: "center",
          width: 300,
          sortable: true,
          render: (h, params) => {
            if (!this.tableData[params.index]) {
              return false;
            }
            return h("div", [
              h("img", {
                props: {
                  type: "success",
                  size: "small"
                },
                attrs: {
                  width: 100,
                  height: 100,
                  class: "goods_img",
                  src: this.tableData[params.index].goods_image
                },
                on: {
                  click: () => {
                    console.log("强制下架");
                  }
                }
              }),
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    class: "goods_name"
                  }
                },
                this.tableData[params.index].goods_name
              )
            ]);
          }
        },
        {
          title: "本店价(元)",
          key: "goods_price",
          align: "center",
          sortable: true,
          width: 110
        },
        {
          title: "库存",
          key: "goods_number",
          align: "center",
          sortable: true,
          width: 80
        },
        {
          title: "状态",
          key: "goods_status",
          align: "center",
          sortable: true,
          width: 80,
          render: (h, params) => {
            if (!this.tableData[params.index]) {
              return false;
            }
            if (this.tableData[params.index].goods_status == 0) {
              //已下架
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "#666"
                    }
                  },
                  "已下架"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "#5BB85D"
                    }
                  },
                  "出售中"
                )
              ]);
            }
          }
        },
        {
          title: "商品重量",
          key: "goods_weight",
          align: "center",
          sortable: true,
          width: 110
        },
        {
          title: "发布时间",
          key: "add_time",
          sortable: true,
          align: "center",
          width: 110,
          render: (h, params) => {
            if (!this.tableData[params.index]) {
              return false;
            }
            return h("div", [
              h(
                "span",
                {
                  style: {
                    marginRight: "5px"
                  }
                },
                util.formatDateTime(
                  this.tableData[params.index].add_time * 1000
                )
              )
            ]);
          }
        },
        {
          title: "排序",
          key: "goods_sort",
          align: "center",
          sortable: true,
          width: 80
        },
        {
          title: "操作",
          align: "center",
          key: "operation",
          render: (h, params) => {
            if (!this.tableData[params.index]) {
              return false;
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.index = params.index;
                      this.modal = true;
                    }
                  }
                },
                "sku"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      console.log("强制下架");
                    }
                  }
                },
                "强制下架"
              )
            ]);
          }
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.changePage(this.page);
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
              for (
                let l = 0;
                l < res.data.data[i].children[j].children.length;
                l++
              ) {
                res.data.data[i].children[j].children[l].label =
                  res.data.data[i].children[j].children[l].cat_name;
                res.data.data[i].children[j].children[l].value =
                  res.data.data[i].children[j].children[l].cat_id;
              }
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
    exports() {
        util
        .post("/goods/exports", {
            page: this.page,
            size: this.size,
            barCode: this.barCode,
            keyWords: this.keyWords,
            shop: this.shop,
            searchCategory: this.searchCategory
        })
        .then(res => {
            if (res.data.code == 0) {
                window.location.href = res.data.data.url
            }
        })
        .catch(err => {
            console.log(err);
        });
    },
    Shelf(dir) {
      if (!this.selection) {
        this.$Message.warning("请选择商品后操作！");
        return;
      }
      let goodsId = [];
      for (let i = 0; i < this.selection.length; i++) {
        goodsId.push(this.selection[i].goods_id);
      }
      util
        .post("/goods/shelf", {
          goodsId: goodsId.join(","),
          shelf: dir
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success(res.data.msg);
            this.changePage(this.page);
            this.selection = null
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.page = 1;
      this.changePage(this.page);
    },
    getCascader(value, selectedData) {
      this.searchCategory = selectedData[selectedData.length - 1];
    },
    selectChange(selection) {
      if (selection.length == this.size) {
        this.allCheck = true;
      } else {
        this.allCheck = false;
      }
      this.selection = selection;
    },
    changePage(page) {
      util
        .post("/goods/ListPage", {
          page: page,
          size: this.size,
          barCode: this.barCode,
          keyWords: this.keyWords,
          shop: this.shop,
          searchCategory: this.searchCategory
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.list.length > 0) {
              this.loadingShow = true;
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.loadingShow = false;
              this.tableData = [];
              this.total = 0;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scope>
.class {
  line-height: 32px;
  height: 35px;
  padding: 20px 0;
}
.class > span {
  float: left;
  margin: 0 10px 0 20px;
}
.class div {
  width: auto;
  float: left;
}
.searchBtn {
  margin-left: 20px;
  height: 36px;
}
.goods .goods-main {
  padding-top: 30px;
}
.goods .goods_img {
  width: 100px;
  float: left;
}
.goods .goods_name {
  height: 33px;
  width: 150px;
  line-height: 17px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  color: #232326;
  float: left;
  margin: 30px 0 0 10px;
}
.ivu-input {
  height: 36px !important;
}
.cz-btn button {
  margin-right: 5px;
}
</style>
