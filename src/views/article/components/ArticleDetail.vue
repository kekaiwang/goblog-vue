<template>
    <div class="createPost-container">
        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
            <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                    Publish
                </el-button>
                <el-button v-loading="loading" type="warning" @click="draftForm">
                    Draft
                </el-button>
            </sticky>

            <div class="createPost-main-container">
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="margin-bottom: 40px;" prop="Title">
                            <MDinput v-model="postForm.Title" :maxlength="100" name="name" required>
                                标题
                            </MDinput>
                        </el-form-item>

                        <div class="postInfo-container">
                            <el-row>
                                <el-col :span="7">
                                    <el-form-item label-width="80px" prop="Author" label="文章作者:" class="postInfo-container-item">
                                        <el-input v-model="postForm.Author" class="article-textarea" autosize placeholder="请输入作者" />
                                    </el-form-item>
                                </el-col>

                                <el-col :span="7">
                                    <el-form-item label-width="80px" label="文章分类 :" class="postInfo-container-item">
                                        <el-select v-model="postForm.CategoryId" class="filter-item" placeholder="请选择" @focus="handleFocusCategory">
                                            <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="10">
                                    <el-form-item label-width="120px" label="创建时间:" class="postInfo-container-item">
                                        <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>

                <el-form-item style="margin-bottom: 40px;" prop="Tag" label-width="80px" label="文章标签 :">
                    <el-select v-model="postForm.TagIds" multiple class="filter-item" size="medium" placeholder="请选择" @focus="handleFocusTag">
                        <el-option v-for="item in tagsList" :key="item.label" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item style="margin-bottom: 40px;" prop="Excerpt" label-width="80px" label="摘要信息 :">
                    <el-input v-model="postForm.Excerpt" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入摘要信息" />
                    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 40px;" prop="Slug" label-width="80px" label="路由地址 :">
                    <el-input v-model="postForm.Slug" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入路由地址" />
                </el-form-item>

                <el-form-item style="margin-bottom: 40px;" prop="Thumb" label-width="80px" label="缩略图 :">
                    <el-input v-model="postForm.Thumb" :rows="1" type="textarea" class="article-textarea" autosize placeholder="从富文本编辑器获取地址" />
                </el-form-item>

                <el-form-item prop="Content" style="margin-bottom: 40px;">
                    <div id="editor">
                        <mavon-editor ref="md" v-model="postForm.Markdown" class="editor" @imgAdd="imgAdd" />
                    </div>
                </el-form-item>

                <!-- <el-form-item prop="Content" style="margin-bottom: 30px;">
                    <Tinymce ref="editor" v-model="postForm.Content" :height="400" />
                </el-form-item> -->
            </div>
        </el-form>
    </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import {
    fetchArticle,
    getCategories,
    getTags,
    createArticle,
    uploadImage,
    updateArticle
} from '@/api/article'

const defaultForm = {
    status: 'draft',
    Title: '', // 文章题目
    Author: '', // 文章作者
    CategoryId: '', // 文章分类
    TagIds: '', // 文章标签
    Content: '', // 文章内容
    Excerpt: '', // 文章摘要
    Slug: '', // 路由地址
    Thumb: '', // 缩略图
    DisplayTime: undefined, // 前台展示时间
    id: undefined,
    IdDraft: '',
    Markdown: ''
}

export default {
    name: 'ArticleDetail',
    components: {
        MDinput,
        Sticky,
        mavonEditor
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const validateRequire = (rule, value, callback) => {
            if (value === '') {
                this.$message({
                    message: rule.field + '为必填项',
                    type: 'error'
                })
                callback(new Error(rule.field + '为必填项'))
            } else {
                callback()
            }
        }
        return {
            postForm: Object.assign({}, defaultForm),
            loading: false,
            userListOptions: [],
            categories: [],
            tagsList: [],
            rules: {
                Title: [{ validator: validateRequire }],
                Author: [{ validator: validateRequire }],
                Content: [{ validator: validateRequire }],
                Excerpt: [{ validator: validateRequire }],
                Slug: [{ validator: validateRequire }]
            },
            tempRoute: {}
        }
    },
    computed: {
        contentShortLength() {
            return this.postForm.Excerpt.length
        },
        displayTime: {
            // set and get is useful when the data
            // returned by the back end api is different from the front end
            // back end return => "2013-06-25 06:59:25"
            // front end need timestamp => 1372114765000
            get() {
                return (+new Date(this.postForm.DisplayTime))
            },
            set(val) {
                this.postForm.DisplayTime = new Date(val)
            }
        }
    },
    created() {
        if (this.isEdit) {
            const id = this.$route.params && this.$route.params.id
            this.fetchData(id)
            this.handleFocusCategory()
            this.handleFocusTag()
        }

        // Why need to make a copy of this.$route here?
        // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
        // https://github.com/PanJiaChen/vue-element-admin/issues/1221
        this.tempRoute = Object.assign({}, this.$route)
    },
    methods: {
        fetchData(id) {
            fetchArticle(id).then(response => {
                response.Data.TagIds = response.Data.TagIds.split(',')
                const tags = response.Data.TagIds.map((item) => {
                    return parseInt(item)
                })

                response.Data.TagIds = tags
                this.postForm = response.Data

                // just for test
                // this.postForm.title += `   Article Id:${this.postForm.Id}`
                this.postForm.content_short += `   Article Id:${this.postForm.Id}`

                // set tagsview title
                this.setTagsViewTitle()

                // set page title
                this.setPageTitle()
            }).catch(err => {
                console.log(err)
            })
        },
        setTagsViewTitle() {
            const title = 'Edit Article'
            const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.Id}` })
            this.$store.dispatch('tagsView/updateVisitedView', route)
        },
        setPageTitle() {
            const title = 'Edit Article'
            document.title = `${title} - ${this.postForm.Id}`
        },
        submitForm() {
            this.postForm.Content = this.$refs['md'].d_render
            const temp = Object.assign({}, this.postForm)
            temp.TagIds = temp.TagIds.join()
            temp.CategoryId = parseInt(temp.CategoryId)
            temp.IsDraft = 2

            this.$refs.postForm.validate(valid => {
                if (valid) {
                    this.loading = true

                    if (this.isEdit === false) {
                        createArticle(temp).then((response) => {
                            this.$notify({
                                title: '成功',
                                message: '发布文章成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.postForm.status = 'published'
                            this.loading = false
                        })
                    } else {
                        updateArticle(temp).then((response) => {
                            this.$notify({
                                title: '成功',
                                message: '发布文章成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.postForm.status = 'published'
                            this.loading = false
                        })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        draftForm() {
            this.postForm.Content = this.$refs['md'].d_render
            if (this.postForm.Content.length === 0 || this.postForm.Title.length === 0) {
                this.$message({
                    message: '请填写必要的标题和内容',
                    type: 'warning'
                })
                return
            }
            const temp = Object.assign({}, this.postForm)
            temp.TagIds = temp.TagIds.join()
            temp.CategoryId = parseInt(temp.CategoryId)
            temp.IsDraft = 1 // 草稿

            this.loading = true

            if (this.isEdit === false) {
                createArticle(temp).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '存储草稿成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.loading = false
                })
            } else {
                updateArticle(temp).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '存储草稿成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.postForm.status = 'published'
                    this.loading = false
                })
            }
            this.$message({
                message: '保存成功',
                type: 'success',
                showClose: true,
                duration: 1000
            })
            this.postForm.status = 'draft'
        },
        handleFocusCategory() {
            if (this.categories.length === 0) {
                getCategories().then((response) => {
                    this.categories = response.Data.map((item) => {
                        return ({
                            id: item.Id,
                            name: item.Name
                        })
                    })
                })
            }
        },
        handleFocusTag() {
            if (this.tagsList.length === 0) {
                getTags().then((response) => {
                    this.tagsList = response.Data.map((item) => {
                        return ({
                            id: item.Id,
                            label: item.Name
                        })
                    })
                })
            }
        },
        imgAdd(pos, $file) {
            const formdata = new FormData()
            formdata.append('image', $file)
            uploadImage(formdata).then(res => {
                this.$refs['md'].$img2Url(pos, 'https://mail.wangkekai.cn/' + res.Data)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
