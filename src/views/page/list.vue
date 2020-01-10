<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

            <router-link to="/page/create" class="link-type">
                <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 10px;">新建页面</el-button>
            </router-link>
        </div>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.Id }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="页面名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="页面标识">
                <template slot-scope="scope">
                    <span>{{ scope.row.Slug }}</span>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态">
                <template slot-scope="{row}">
                    <el-tag :type="row.Status | statusFilter">
                        {{ row.Status | statusText }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="阅读数量">
                <template slot-scope="scope">
                    <span>{{ scope.row.Preview }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.Created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column align="left" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <router-link :to="'/page/edit/' + scope.row.Slug" class="link-type">
                        <el-button v-if="scope.row.Status < 3" type="primary" size="mini">
                            编辑
                        </el-button>
                    </router-link>
                    <el-button v-if="scope.row.Status < 3" type="warning" size="mini" style="margin-left: 10px;" @click="handleChangeStatus(scope.row, 3)">
                        删除
                    </el-button>
                    <el-button v-else type="success" size="mini" style="margin-left: 10px;" @click="handleChangeStatus(scope.row, 1)">
                        启用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPageList" />
    </div>
</template>

<script>
import {
    fetchPageList
} from '@/api/page'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
    name: 'PageList',
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'success',
                2: 'warning',
                3: 'danger'
            }
            return statusMap[status]
        },
        statusText(status) {
            const statusMap = {
                1: '正常',
                2: '禁用',
                3: '删除'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10,
                name: ''
            }
        }
    },
    created() {
        this.getPageList()
    },
    methods: {
        getPageList() {
            this.listLoading = true
            fetchPageList(this.listQuery).then(response => {
                this.list = response.Data.Data
                this.total = response.Data.Total
                this.listLoading = false
            })
        },
        handleFilter() {
            this.listQuery.limit = 10
            this.listQuery.page = 1
            this.getPageList()
        }
    }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
