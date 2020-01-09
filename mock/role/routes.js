// Just a mock data

export const constantRoutes = [
    {
        path: '/redirect',
        component: 'layout/Layout',
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: 'views/redirect/index'
            }
        ]
    },
    {
        path: '/login',
        component: 'views/login/index',
        hidden: true
    },
    {
        path: '/404',
        component: 'views/error-page/404',
        hidden: true
    },
    {
        path: '/401',
        component: 'views/error-page/401',
        hidden: true
    },
    {
        path: '',
        component: 'layout/Layout',
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: 'views/dashboard/index',
                name: 'Dashboard',
                meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
            }
        ]
    },
    {
        path: '/guide',
        component: 'layout/Layout',
        redirect: '/guide/index',
        children: [
            {
                path: 'index',
                component: 'views/guide/index',
                name: 'Guide',
                meta: { title: 'Guide', icon: 'guide', noCache: true }
            }
        ]
    }
]

export const asyncRoutes = [
    {
        path: '/permission',
        component: 'layout/Layout',
        redirect: '/permission/index',
        alwaysShow: true,
        meta: {
            title: 'Permission',
            icon: 'lock',
            roles: ['admin', 'editor']
        },
        children: [
            {
                path: 'page',
                component: 'views/permission/page',
                name: 'PagePermission',
                meta: {
                    title: 'Page Permission',
                    roles: ['admin']
                }
            },
            {
                path: 'directive',
                component: 'views/permission/directive',
                name: 'DirectivePermission',
                meta: {
                    title: 'Directive Permission'
                }
            },
            {
                path: 'role',
                component: 'views/permission/role',
                name: 'RolePermission',
                meta: {
                    title: 'Role Permission',
                    roles: ['admin']
                }
            }
        ]
    },

    {
        path: '/icon',
        component: 'layout/Layout',
        children: [
            {
                path: 'index',
                component: 'views/icons/index',
                name: 'Icons',
                meta: { title: 'Icons', icon: 'icon', noCache: true }
            }
        ]
    },

    {
        path: '/components',
        component: 'layout/Layout',
        redirect: 'noRedirect',
        name: 'ComponentDemo',
        meta: {
            title: 'Components',
            icon: 'component'
        },
        children: [
            {
                path: 'sticky',
                component: 'views/components-demo/sticky',
                name: 'StickyDemo',
                meta: { title: 'Sticky' }
            },
            {
                path: 'count-to',
                component: 'views/components-demo/count-to',
                name: 'CountToDemo',
                meta: { title: 'Count To' }
            },
            {
                path: 'back-to-top',
                component: 'views/components-demo/back-to-top',
                name: 'BackToTopDemo',
                meta: { title: 'Back To Top' }
            }
        ]
    },

    {
        path: '/error',
        component: 'layout/Layout',
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: {
            title: 'Error Pages',
            icon: '404'
        },
        children: [
            {
                path: '401',
                component: 'views/error-page/401',
                name: 'Page401',
                meta: { title: 'Page 401', noCache: true }
            },
            {
                path: '404',
                component: 'views/error-page/404',
                name: 'Page404',
                meta: { title: 'Page 404', noCache: true }
            }
        ]
    },

    {
        path: '/error-log',
        component: 'layout/Layout',
        redirect: 'noRedirect',
        children: [
            {
                path: 'log',
                component: 'views/error-log/index',
                name: 'ErrorLog',
                meta: { title: 'Error Log', icon: 'bug' }
            }
        ]
    },

    {
        path: '/excel',
        component: 'layout/Layout',
        redirect: '/excel/export-excel',
        name: 'Excel',
        meta: {
            title: 'Excel',
            icon: 'excel'
        },
        children: [
            {
                path: 'export-excel',
                component: 'views/excel/export-excel',
                name: 'ExportExcel',
                meta: { title: 'Export Excel' }
            },
            {
                path: 'export-selected-excel',
                component: 'views/excel/select-excel',
                name: 'SelectExcel',
                meta: { title: 'Select Excel' }
            },
            {
                path: 'export-merge-header',
                component: 'views/excel/merge-header',
                name: 'MergeHeader',
                meta: { title: 'Merge Header' }
            },
            {
                path: 'upload-excel',
                component: 'views/excel/upload-excel',
                name: 'UploadExcel',
                meta: { title: 'Upload Excel' }
            }
        ]
    },

    {
        path: '/zip',
        component: 'layout/Layout',
        redirect: '/zip/download',
        alwaysShow: true,
        meta: { title: 'Zip', icon: 'zip' },
        children: [
            {
                path: 'download',
                component: 'views/zip/index',
                name: 'ExportZip',
                meta: { title: 'Export Zip' }
            }
        ]
    },

    {
        path: '/pdf',
        component: 'layout/Layout',
        redirect: '/pdf/index',
        children: [
            {
                path: 'index',
                component: 'views/pdf/index',
                name: 'PDF',
                meta: { title: 'PDF', icon: 'pdf' }
            }
        ]
    },
    {
        path: '/pdf/download',
        component: 'views/pdf/download',
        hidden: true
    },

    {
        path: '/theme',
        component: 'layout/Layout',
        redirect: 'noRedirect',
        children: [
            {
                path: 'index',
                component: 'views/theme/index',
                name: 'Theme',
                meta: { title: 'Theme', icon: 'theme' }
            }
        ]
    },

    {
        path: '/clipboard',
        component: 'layout/Layout',
        redirect: 'noRedirect',
        children: [
            {
                path: 'index',
                component: 'views/clipboard/index',
                name: 'ClipboardDemo',
                meta: { title: 'Clipboard Demo', icon: 'clipboard' }
            }
        ]
    },

    {
        path: '/i18n',
        component: 'layout/Layout',
        children: [
            {
                path: 'index',
                component: 'views/i18n-demo/index',
                name: 'I18n',
                meta: { title: 'I18n', icon: 'international' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
]
