<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions"
              :props="{ checkStrictly: true }">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
       <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>副标题： {{scope.row.subtitle}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>原始价格：￥{{scope.row.originalprice}}</p>
            <p>折后价格：{{scope.row.promoteprice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.stock}}</p></template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.createdate | formatDate}}</p></template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
      <el-dialog
        :title="isEdit?'编辑product':'添加product'"
        :visible.sync="dialogVisible"
        width="80%">
        <el-form :model="product"
                 ref="productForm"
                 label-width="300px" size="small">
          <el-form-item label="product名称：" >
            <el-input v-model="product.name" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="productSubtitle：">
            <el-input v-model="product.subtitle" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="productOriginalPrice：">
            <el-input v-model="product.originalprice" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="productPromotePrice：">
            <el-input v-model="product.promoteprice" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="productStock：">
            <el-input v-model="product.stock" style="width: 150px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  updateDeleteStatus,
  updateNewStatus,
  updateRecommendStatus,
  updateProduct, createProduct
} from '../api/product'
import {fetchList as fetchBrandList} from '../api/brand'
import {fetchListWithChildren} from '../api/category'
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
}
const defaultProduct = {
  id: null,
  name: null
}
export default {
  name: 'productList',
  data () {
    return {
      product: Object.assign({}, defaultProduct),
      dialogVisible: false,
      isEdit: false,
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
      verifyStatusOptions: [{
        value: 1,
        label: '审核通过'
      }, {
        value: 0,
        label: '未审核'
      }]
    }
  },
  created () {
    this.getList()
    this.getProductCateList()
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.listQuery.productCategoryId = newValue[1]
      } else {
        this.listQuery.productCategoryId = null
      }
    }
  },
  methods: {
    getProductSkuSp (row, index) {
      let spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getBrandList () {
      fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = []
        let brandList = response.data.list
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id})
        }
      })
    },
    getProductCateList () {
      fetchListWithChildren().then(response => {
        let list = response.data
        this.productCateOptions = []
        for (let i = 0; i < list.length; i++) {
          let children = []
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id})
            }
          }
          this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children})
        }
      })
    },
    handleSearchList () {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleAddProduct () {
      this.dialogVisible = true
      this.isEdit = false
      this.product = Object.assign({}, defaultProduct)
    },
    handleSizeChange (val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleResetSearch () {
      this.selectProductCateValue = []
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleUpdateProduct (index, row) {
      this.isEdit = true
      this.dialogVisible = true
      this.product = Object.assign({}, row)
    },
    handleShowProduct (index, row) {
      console.log('handleShowProduct', row)
    },
    handleShowVerifyDetail (index, row) {
      console.log('handleShowVerifyDetail', row)
    },
    handleShowLog (index, row) {
      console.log('handleShowLog', row)
    },
    handleDialogConfirm () {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateProduct(this.product.id, this.product).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        } else {
          createProduct(this.product).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    updateNewStatus (newStatus, ids) {
      let params = new URLSearchParams()
      params.append('ids', ids)
      params.append('newStatus', newStatus)
      updateNewStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    updateRecommendStatus (recommendStatus, ids) {
      let params = new URLSearchParams()
      params.append('ids', ids)
      params.append('recommendStatus', recommendStatus)
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleDelete (index, row) {
      this.$confirm('是否要删除该品牌', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateDeleteStatus(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
<style></style>
