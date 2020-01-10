<template>
    <div class="createPost-container">
        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
            <div class="createPost-main-container">
                <el-form-item style="margin-bottom: 20px;" prop="Name">
                    <MDinput v-model="postForm.Name" :maxlength="100" name="name" required>
                        页面名称
                    </MDinput>
                </el-form-item>

                <el-form-item style="margin-bottom: 20px;" prop="Slug">
                    <MDinput v-model="postForm.Slug" :maxlength="100" name="name" required>
                        页面标识
                    </MDinput>
                </el-form-item>

                <el-form-item prop="Content" style="margin-bottom: 40px;">
                    <div id="editor">
                        <mavon-editor ref="md" v-model="postForm.Markdown" class="editor" @imgAdd="imgAdd" />
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm">{{ buttonText }}</el-button>
                    <router-link to="/page/list" style="margin-left: 10px;">
                        <el-button>取消</el-button>
                    </router-link>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import MDinput from '@/components/MDinput'
import {
    uploadImage
} from '@/api/article'
import {
    createPage,
    updatePage,
    fetchPage
} from '@/api/page'

const defaultForm = {
    id: undefined,
    status: 'draft',
    Name: '',
    Content: '',
    Slug: '',
    Markdown: ''
}

export default {
    name: 'PageDetail',
    components: {
        MDinput,
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
            rules: {
                Name: [{ validator: validateRequire }],
                Content: [{ validator: validateRequire }],
                Slug: [{ validator: validateRequire }]
            },
            tempRoute: {}
        }
    },
    computed: {
        buttonText() {
            if (this.isEdit === true) {
                return '确定更新'
            } else {
                return '创建页面'
            }
        }
    },
    created() {
        if (this.isEdit) {
            const slug = this.$route.params && this.$route.params.slug
            this.fetchData(slug)
        }

        // Why need to make a copy of this.$route here?
        // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
        // https://github.com/PanJiaChen/vue-element-admin/issues/1221
        this.tempRoute = Object.assign({}, this.$route)
    },
    methods: {
        fetchData(slug) {
            fetchPage(slug).then(response => {
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
            const title = 'Edit Page'
            const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.Id}` })
            this.$store.dispatch('tagsView/updateVisitedView', route)
        },
        setPageTitle() {
            const title = 'Edit Page'
            document.title = `${title} - ${this.postForm.Id}`
        },
        submitForm() {
            this.postForm.Content = this.$refs['md'].d_render
            const temp = Object.assign({}, this.postForm)

            this.$refs.postForm.validate(valid => {
                if (valid) {
                    this.loading = true

                    if (this.isEdit === false) {
                        createPage(temp).then((response) => {
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
                        updatePage(temp).then((response) => {
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
        imgAdd(pos, $file) {
            const formdata = new FormData()
            formdata.append('image', $file)
            uploadImage(formdata).then(res => {
                this.$refs['md'].$img2Url(pos, 'http://q3s0ldd3z.bkt.clouddn.com/' + res.Data)
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
