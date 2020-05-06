import {
    post,
    get,
    put,
    _delete
} from '@/services/plugins/axios'

import {
    saveTokens,
    saveAccessToken,
    getToken
} from '../utils/cookie'


export default class User {
    static async getToken(account, password) {
        const tokens = await post('user/login', {
            account,
            password
        })
        saveTokens(tokens.access_token, tokens.refresh_token)
        return tokens
    }

    static async getUserInfo() {
        const data = await get('user/info')
        return data
    }

    static async getUserInfoByUid(uid) {
        const data = await get(`user/info/${uid}`)
        return data
    }

    // 刷新令牌
    static async getRefreshToken() {
        const access_token = getToken('access_token').replace("Bearer ", "")
        const refresh_token = getToken('refresh_token').replace("Bearer ", "")
        const res = await post('user/refresh', {
            access_token,
            refresh_token
        })
        saveAccessToken(res.new_access_token)
    }

    static async getAll(start, count) {
        return await get('user/all', { start, count })
    }

    static async editUser(id, account, password, group_id, nickname) {
        await put('user/edit', {
            id,
            account,
            password,
            group_id,
            nickname,
        })
    }

    static async addUser(nickname, account, password, group_id) {
        await post('user/register', {
            nickname,
            account,
            password,
            group_id
        })
    }
    static async deleteUser(id) {
        await _delete('/user/delete', { id })
    }

    static async changePassword(oldPassword, newPassword) {
        return await put('/user/password', {
            old_password: oldPassword,
            password: newPassword
        })
    }

}