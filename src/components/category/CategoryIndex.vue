<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch>
      </switch>
      <!--<SideMenu></SideMenu>-->
      <el-button @click="handleAddProductCate">添加</el-button>
    </el-aside>
    <el-main>
      <!--<books></books>-->

      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
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

      <el-dialog
        :title="isEdit?'编辑分类':'添加分类'"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form :model="category"
                 ref="categoryForm"
                 label-width="150px" size="small">
          <el-form-item label="分类名称：">
            <el-input v-model="category.name" style="width: 100px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>

import {fetchList, deleteProductCate, createProductCate,updateProductCate} from '../api/category'
const defaultCategory = {
  id: null,
  name: null
}
export default {
  name: 'productCateList',
  data () {
    return {
      category: Object.assign({},defaultCategory),
      dialogVisible: false,
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
  created () {
    this.resetParentId()
    this.getList()
  },
  methods: {
    resetParentId () {
      this.listQuery.pageNum = 1
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    handleAddProductCate () {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDialogConfirm () {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateProductCate(this.category.id,this.category).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else {
          createProductCate(this.category).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        }
      })
    },
    getList () {
      this.listLoading = true
      fetchList(this.parentId, this.listQuery).then(response => {
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
      this.category = Object.assign({}, row)
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
