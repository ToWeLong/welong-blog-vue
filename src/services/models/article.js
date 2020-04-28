import {
    post,
    get,
    put,
    _delete
} from '@/services/plugins/axios'

export default class Article {
    static async getAll(start,count) {
        const res = await get('article/all',{start,count})
        return res
    }
    static async addArticle(title, description, image, content, tag_id) {
        await post('article/make', { title, description, image, content, tag_id })
    }

    static async updateStatus(id, status) {
        await put('article/status', { id, status })
    }

    static async updateArticle(id, title, description, image, content, tag_id) {
        await put('article/edit', { id, title, description, image, content, tag_id })
    }

    static async deleteArticle(id){
        await _delete('article/delete',{id})
    }
}