import request from '@/utils/request'

export function fetchPageList(query) {
    return request({
        url: '/admin/page/pageList',
        method: 'get',
        params: query
    })
}

export function createPage(data) {
    return request({
        url: '/admin/page/createPage',
        method: 'put',
        data
    })
}

export function updatePage(data) {
    return request({
        url: '/admin/page/updatePage',
        method: 'post',
        data
    })
}

export function fetchPage(slug) {
    return request({
        url: 'admin/page/detail',
        method: 'get',
        params: { slug }
    })
}
