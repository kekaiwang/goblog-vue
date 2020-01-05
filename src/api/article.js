import request from '@/utils/request'

export function fetchArticleList(query) {
    return request({
        url: '/admin/articleList',
        method: 'get',
        params: query
    })
}

export function fetchClassifyList(query) {
    return request({
        url: 'admin/article/classifyList',
        method: 'get',
        params: query
    })
}

export function createClassify(data) {
    return request({
        url: 'admin/article/createClassify',
        method: 'put',
        data
    })
}

export function updateClassify(data) {
    return request({
        url: 'admin/article/updateClassify',
        method: 'post',
        data
    })
}

export function modifyClassify(data) {
    return request({
        url: 'admin/article/modifyClassify',
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
