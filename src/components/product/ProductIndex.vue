<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch>
      </switch>
      <!--<SideMenu></SideMenu>-->
      <span @click="handleSizeChange">logout</span>
    </el-aside>
    <el-main>
      <!--<books></books>-->

      <el-table ref="productTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="副标题" align="center">
          <template slot-scope="scope">{{scope.row.subtitle}}</template>
        </el-table-column>
        <el-table-column label="原始价格" align="center">
          <template slot-scope="scope">{{scope.row.originalprice}}</template>
        </el-table-column>
        <el-table-column label="折后价格" align="center">
          <template slot-scope="scope">{{scope.row.promoteprice}}</template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">{{scope.row.stock}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createdate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-main>
  </el-container>
</template>
<script>

import {fetchList, deleteProductCate, updateProduct} from '../api/product'
const defaultProduct = {
  id: null,
  name: null,
  subtitle: null,
  originalprice: null,
  promoteprice: null,
  stock: null,
  createtime: null
}
export default {
  name: 'productList',
  data () {
    return {
      product: Object.assign({}, defaultProduct),
      isEdit: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      parentId: 0,
      token: this.$store.getters.token,
      username: this.$store.getters.name
    }
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
  created () {
    this.getList()
  },
  methods: {
    handleAddProductCate () {
      this.$router.push('/pms/addProductCate')
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
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
    handleTransferProduct (index, row) {
      console.log('handleAddProductCate')
    },
    handleUpdate (index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.product = Object.assign({}, row)
    },
    handleDelete (index, row) {
      this.$confirm('是否要删除该品牌', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductCate(row.id).then(response => {
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

<style scoped>

</style>
