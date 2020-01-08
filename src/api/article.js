import request from '@/utils/request'

export function fetchArticleList(query) {
    return request({
        url: '/admin/article/articleList',
        method: 'get',
        params: query
    })
}

// ------------- tag -------------
export function fetchTagList(query) {
    return request({
        url: 'admin/article/tagList',
        method: 'get',
        params: query
    })
}

export function createTag(data) {
    return request({
        url: 'admin/article/createTag',
        method: 'put',
        data
    })
}

export function updateTag(data) {
    return request({
        url: 'admin/article/updateTag',
        method: 'post',
        data
    })
}

// ------------- category -------------
export function fetchCategoryList(data) {
    return request({
        url: 'admin/article/categoryList',
        method: 'get',
        params: data
    })
}

export function createCategory(data) {
    return request({
        url: 'admin/article/createCategory',
        method: 'put',
        data
    })
}

export function updateCategory(data) {
    return request({
        url: 'admin/article/updateCategory',
        method: 'post',
        data
    })
}

// ----------- article -------------
export function fetchArticle(id) {
    return request({
        url: 'admin/article/detail',
        method: 'get',
        params: { id }
    })
}

export function getCategories() {
    return request({
        url: 'admin/article/getCategories',
        method: 'get'
    })
}

export function getTags() {
    return request({
        url: 'admin/article/getTags',
        method: 'get'
    })
}

export function createArticle(data) {
    return request({
        url: 'admin/article/createArticle',
        method: 'put',
        data
    })
}

export function fetchPv(pv) {
    return request({
        url: '/article/pv',
        method: 'get',
        params: { pv }
    })
}

export function updateArticle(data) {
    return request({
        url: '/article/update',
        method: 'post',
        data
    })
}
