<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

            <router-link to="/article/create" class="link-type">
                <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 10px;">新建文章</el-button>
            </router-link>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.Id }}</span>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="Date">
                <template slot-scope="scope">
                    <span>{{ scope.row.Created | parseTime('{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="显示时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.DisplayTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态" width="110">
                <template slot-scope="{row}">
                    <el-tag :type="row.IsDraft | statusFilter">
                        {{ row.IsDraft | statusText }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="作者">
                <template slot-scope="scope">
                    <span>{{ scope.row.Author }}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="分类">
                <template slot-scope="scope">
                    <span>{{ scope.row.CategoryName }}</span>
                </template>
            </el-table-column>

            <!-- <el-table-column width="100px" label="Importance">
                <template slot-scope="scope">
                    <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
                </template>
            </el-table-column> -->

            <el-table-column min-width="300px" label="标题">
                <template slot-scope="{row}">
                    <router-link :to="'/article/edit/'+row.Id" class="link-type">
                        <span>{{ row.Title }}</span>
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <router-link :to="'/article/edit/'+scope.row.Id">
                        <el-button type="primary" size="small" icon="el-icon-edit">
                            编辑
                        </el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getArticleList" />
    </div>
</template>

<script>
import { fetchArticleList } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
    name: 'ArticleList',
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'info',
                2: 'success',
                3: 'danger'
            }
            return statusMap[status]
        },
        statusText(status) {
            const statusMap = {
                1: '草稿',
                2: '已发布',
                3: '已删除'
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
                title: ''
            }
        }
    },
    created() {
        this.getArticleList()
    },
    methods: {
        getArticleList() {
            this.listLoading = true
            fetchArticleList(this.listQuery).then(response => {
                this.list = response.Data.Data
                this.total = response.Data.Total
                this.listLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.listQuery.limit = 10
            this.getArticleList()
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
