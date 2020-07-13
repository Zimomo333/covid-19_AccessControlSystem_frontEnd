<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="Id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="Id" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Open_id" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.open_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改密码
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleResetOpenId(row)">
            初始化
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="'添加检查员'" :visible.sync="dialogCreateVisible">
      <el-form ref="createForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="new_password">
          <el-input v-model="temp.new_password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="temp.confirm_password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'修改密码'" :visible.sync="dialogUpdateVisible">
      <el-form ref="updateForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Id">
          <span style="margin-left:15px;">{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span style="margin-left:15px;">{{ temp.username }}</span>
        </el-form-item>
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="temp.old_password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="temp.new_password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="temp.confirm_password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchInspector, createInspector, updateInspector, deleteInspector, resetOpenId } from '@/api/account'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.temp.new_password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: undefined,
        username: undefined,
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        username: undefined,
        old_password: undefined,
        new_password: undefined,
        confirm_password: undefined
      },
      dialogCreateVisible: false,
      dialogUpdateVisible: false,
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        new_password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirm_password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchInspector(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: undefined,
        old_password: undefined,
        new_password: undefined,
        confirm_password: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['createForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          createInspector(this.temp).then(res => {
            var result = res.data.result
            if (result === 0) {
              this.temp.id = res.data.id
              this.temp.new_password = undefined
              this.temp.confirm_password = undefined
              this.list.unshift(this.temp) // 向数组首插入
              this.dialogCreateVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else if (result === 1) {
              this.$notify({
                title: '失败',
                message: '用户名已存在',
                type: 'error',
                duration: 2000
              })
            } else if (result === 2) {
              this.$notify({
                title: '失败',
                message: '两次密码不一致',
                type: 'error',
                duration: 2000
              })
            } else if (result === 3) {
              this.$notify({
                title: '失败',
                message: '读写错误',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogUpdateVisible = true
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    handleResetOpenId(row) {
      resetOpenId(row.id).then(res => {
        if (res.data.result === 0) {
          this.$notify({
            title: '成功',
            message: '初始化成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.findIndex(v => v.id === row.id)
          row.open_id = ''
          this.list.splice(index, 1, row)
        } else {
          this.$notify({
            title: '失败',
            message: '初始化失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    updateData() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          updateInspector(this.temp).then(res => {
            var result = res.data.result
            if (result === 0) {
              this.dialogUpdateVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else if (result === 1) {
              this.$notify({
                title: '失败',
                message: '两次密码不一致',
                type: 'error',
                duration: 2000
              })
            } else if (result === 2) {
              this.$notify({
                title: '失败',
                message: '旧密码不正确',
                type: 'error',
                duration: 2000
              })
            } else if (result === 3) {
              this.$notify({
                title: '失败',
                message: '读写错误',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteInspector(row.id).then(res => {
        if (res.data.result === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
