<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="Id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.resident_id" placeholder="resident_id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.inspector_id" placeholder="Inspector_id" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.health_query" placeholder="Temperature" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in healthOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery.date_query"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
      <el-table-column label="Temperature" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temperature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="time" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Resident_id(点击查看住户)" width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleInfo(row.resident_id)">{{ row.resident_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Inspectors_id" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.inspector_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogInfoVisible" title="详细信息">
      <el-form v-if="temp!=null" label-position="right" label-width="100px" style="width: 500px;margin-left: 200px;" size="small">
        <el-form-item label="头像">
          <el-avatar :size="50" :src="temp[0].photo"></el-avatar>
        </el-form-item>
        <el-form-item label="Open_id">
          <span style="margin-left:15px;">{{ temp[0].open_id }}</span>
        </el-form-item>
        <el-form-item label="Id">
          <span style="margin-left:15px;">{{ temp[0].id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span style="margin-left:15px;">{{ temp[0].username }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span style="margin-left:15px;">{{ temp[0].name }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span style="margin-left:15px;">{{ temp[0].sex | sexFilter }}</span>
        </el-form-item>
        <el-form-item label="身份证号码">
          <span style="margin-left:15px;">{{ temp[0].identity_card }}</span>
        </el-form-item>
        <el-form-item label="住址号">
          <span style="margin-left:15px;">{{ temp[0].house_no }}</span>
        </el-form-item>
        <el-form-item label="健康状态">
          <span style="margin-left:15px;">{{ temp[0].health_status | statusFilter }}</span>
        </el-form-item>
        <el-form-item label="出入次数">
          <span style="margin-left:15px;">{{ temp[0].access_times }}</span>
        </el-form-item>
        <el-form-item label="锁定状态">
          <span style="margin-left:15px;">{{ temp[0].is_locked | lockedFilter }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogInfoVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteRecord, fetchRecordList } from '@/api/record'
import { fetchInfo } from '@/api/account'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    typeFilter(status) {
      if (status > 5) { return 'danger' } else { return 'success' }
    },
    statusFilter(status) {
      if (status > 5) { return 'unhealthy' } else { return 'healthy' }
    },
    sexFilter(sex) {
      if (sex === 0) { return '未知' } else if (sex === 1) { return '男' } else { return '女' }
    },
    lockedFilter(locked) {
      if (locked) { return '锁定' } else { return '未锁定' }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: '',
        resident_id: '',
        inspector_id: '',
        date_query: '',
        health_query: '',
        sort: '+id'
      },
      healthOptions: ['healthy', 'unhealthy'],
      temp: null,
      dialogInfoVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      fetchRecordList(this.listQuery).then(response => {
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
    handleDelete(row, index) {
      deleteRecord(row.id).then(res => {
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
    handleInfo(resident_id) {
      fetchInfo(resident_id).then(response => {
        this.temp = response.data.info
        this.dialogInfoVisible = true
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
