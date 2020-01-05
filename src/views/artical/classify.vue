<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 10px;" @click="handleCreate">新建</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.Id }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name }}</span>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态">
                <template slot-scope="{row}">
                    <el-tag :type="row.Status | statusFilter">
                        {{ row.Status | statusText }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="关联数量">
                <template slot-scope="scope">
                    <span>{{ scope.row.UseTimes }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.Created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column align="left" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.Status < 3" type="primary" size="mini" @click="handleUpdate(scope.row)">
                        编辑
                    </el-button>
                    <el-button v-if="scope.row.Status < 3" type="warning" size="mini" @click="handleDelete(scope.row)">
                        删除
                    </el-button>
                    <el-button v-else type="success" size="mini" @click="handleActive(scope.row)">
                        启用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getClassifyList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="temp.name" />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                        <el-option v-for="(item, key) in statusOptions" :key="item" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    fetchClassifyList,
    createClassify,
    updateClassify,
    modifyClassify
} from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
    name: 'TagList',
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
                limit: 20
            },
            temp: {
                id: undefined,
                name: '',
                status: 1
            },
            statusOptions: {
                1: '正常',
                2: '禁用',
                3: '删除'
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑',
                create: '新建'
            },
            rules: {
                name: [{ required: true, message: '名称必填', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getClassifyList()
    },
    methods: {
        getClassifyList() {
            this.listLoading = true
            fetchClassifyList(this.listQuery).then(response => {
                this.list = response.Data.Data
                this.total = response.Data.Total
                this.listLoading = false
            })
        },
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.resetTemp()
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                name: '',
                status: '1'
            }
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.temp.status = parseInt(this.temp.status)
                    createClassify(this.temp).then((response) => {
                        this.list.unshift(response.Data)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleUpdate(row) {
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.temp = {
                id: row.Id,
                name: row.Name,
                status: String(row.Status)
            }

            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    tempData.status = parseInt(tempData.status)

                    updateClassify(tempData).then(() => {
                        // for (const v of this.list) {
                        //     if (v.Id === this.temp.id) {
                        //         const index = this.list.indexOf(v)
                        //         this.list.splice(index, 1, this.temp)
                        //         break
                        //     }
                        // }
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Update Successfully',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const tempData = Object.assign({}, row)
                tempData.Status = 3
                modifyClassify(tempData).then(() => {
                    for (const v of this.list) {
                        if (v.Id === tempData.Id) {
                            const index = this.list.indexOf(v)
                            this.list.splice(index, 1, tempData)
                            break
                        }
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleActive(row) {
            this.$confirm('此操作将重新启用该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const tempData = Object.assign({}, row)
                tempData.Status = 1
                modifyClassify(tempData).then(() => {
                    for (const v of this.list) {
                        if (v.Id === tempData.Id) {
                            const index = this.list.indexOf(v)
                            this.list.splice(index, 1, tempData)
                            break
                        }
                    }
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消启用'
                })
            })
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
