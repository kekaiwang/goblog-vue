/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
    path: '/components',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ComponentDemo',
    meta: {
        title: 'Components',
        icon: 'component'
    },
    children: [
        {
            path: 'sticky',
            component: () => import('@/views/components-demo/sticky'),
            name: 'StickyDemo',
            meta: { title: 'Sticky' }
        },
        {
            path: 'count-to',
            component: () => import('@/views/components-demo/count-to'),
            name: 'CountToDemo',
            meta: { title: 'Count To' }
        },
        {
            path: 'back-to-top',
            component: () => import('@/views/components-demo/back-to-top'),
            name: 'BackToTopDemo',
            meta: { title: 'Back To Top' }
        }
    ]
}

export default componentsRouter
