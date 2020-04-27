import {
    post,
    get,
    put,
    _delete
} from '@/services/plugins/axios'

export default class Group {
    static async getUserGroup(uid) {
        return await get(`group/${uid}`)
    }

    static async getGroupAll() {
        return await get('group/all')
    }

    static async getGroups() {
        return await get('group/alls')
    }
    static async addGroup(group_name, scope) {
        await post('group/add', { group_name, scope })
    }
    static async editGroup(group_name, scope, id) {
        await put('/group/edit', { group_name, scope, id })
    }

    static async deleteGroup(id){
        await _delete('/group/delete',{id})
    }
}