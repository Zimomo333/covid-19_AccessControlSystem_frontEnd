<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="Id" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.locked_query" placeholder="is_locked" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in lockedOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.health_query" placeholder="health_status" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in healthOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-table-column label="姓名(点击查看详情)" width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleInfo(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入记录(点击查看近况)" align="center" width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleRecord(row.id)">{{ row.access_times }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状况" class-name="status-col" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.health_status | typeFilter">
            {{ row.health_status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="!row.is_locked" size="mini" type="success" @click="handleModifyStatus(row,true)">
            锁定
          </el-button>
          <el-button v-if="row.is_locked" size="mini" @click="handleModifyStatus(row,false)">
            解锁
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogInfoVisible" title="详细信息">
      <el-form v-if="index!=-1" label-position="right" label-width="100px" style="width: 500px;margin-left: 200px;" size="small">
        <el-form-item label="头像">
          <el-avatar :size="50" :src="list[index].photo" />
        </el-form-item>
        <el-form-item label="Open_id">
          <span style="margin-left:15px;">{{ list[index].open_id }}</span>
        </el-form-item>
        <el-form-item label="Id">
          <span style="margin-left:15px;">{{ list[index].id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span style="margin-left:15px;">{{ list[index].username }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span style="margin-left:15px;">{{ list[index].name }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span style="margin-left:15px;">{{ list[index].sex | sexFilter }}</span>
        </el-form-item>
        <el-form-item label="身份证号码">
          <span style="margin-left:15px;">{{ list[index].identity_card }}</span>
        </el-form-item>
        <el-form-item label="住址号">
          <span style="margin-left:15px;">{{ list[index].house_no }}</span>
        </el-form-item>
        <el-form-item label="健康状态">
          <span style="margin-left:15px;">{{ list[index].health_status | statusFilter }}</span>
        </el-form-item>
        <el-form-item label="出入次数">
          <span style="margin-left:15px;">{{ list[index].access_times }}</span>
        </el-form-item>
        <el-form-item label="锁定状态">
          <span style="margin-left:15px;">{{ list[index].is_locked | lockedFilter }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogInfoVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogRcVisible" title="最近出入记录">
      <el-table :data="rcData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="Date" prop="time" align="center">
          <template slot-scope="{row}">
            <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="temperature" label="Temperature" align="center" />
        <el-table-column prop="inspector_id" label="Inspectors_id" align="center" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogRcVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchResident } from '@/api/account'
import { fetchRecord } from '@/api/record'

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
        id: undefined,
        name: undefined,
        locked_query: undefined,
        health_query: undefined,
        sort: '+id'
      },
      lockedOptions: ['locked', 'unlocked'],
      healthOptions: ['healthy', 'unhealthy'],
      index: -1,
      dialogInfoVisible: false,
      dialogStatus: '',
      dialogRcVisible: false,
      rcData: [],
      infoData: [],
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
      fetchResident(this.listQuery).then(response => {
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
    handleModifyStatus(row, is_locked) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.is_locked = is_locked
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
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleRecord(id) {
      fetchRecord(id).then(response => {
        this.rcData = response.data.rcData
        this.dialogRcVisible = true
      })
    },
    handleInfo(row) {
      this.index = this.list.findIndex(v => v.id === row.id)
      this.dialogInfoVisible = true
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
