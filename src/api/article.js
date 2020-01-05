import request from '@/utils/request'

export function fetchArticleList(query) {
    return request({
        url: '/admin/article/articleList',
        method: 'get',
        params: query
    })
}

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

export function modifyTag(data) {
    return request({
        url: 'admin/article/modifyTag',
        method: 'post',
        data
    })
}

export function fetchArticle(id) {
    return request({
        url: '/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/article/pv',
        method: 'get',
        params: { pv }
    })
}

export function createArticle(data) {
    return request({
        url: '/article/create',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/article/update',
        method: 'post',
        data
    })
}
