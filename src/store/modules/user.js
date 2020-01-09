import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                // const { data } = response
                commit('SET_TOKEN', response.Data)
                setToken(response.Data)
                resolve()
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { Data } = response

                if (!Data) {
                    reject('Verification failed, please Login again.')
                }

                const { Roles, Name, Avatar, Introduction } = Data

                // roles must be a non-empty array
                if (!Roles || Roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                commit('SET_ROLES', Roles)
                commit('SET_NAME', Name)
                commit('SET_AVATAR', Avatar)
                commit('SET_INTRODUCTION', Introduction)
                resolve(Data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()

                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, { root: true })

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
