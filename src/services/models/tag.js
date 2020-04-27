import {
    post,
    get,
    put,
    _delete
} from '@/services/plugins/axios'

export default class Tag {
    static async addTag(tag_name) {
        await post('tag/add', {
            tag_name
        })
    }

    static async getTagIdByArticleId(article_id) {
        const article = await get(`/tag/${article_id}`)
        return article
    }

    static async getAll() {
        const tagList = await get('tag/admin/all')
        return tagList
    }

    static async getAllFilter() {
        const tagList = await get('tag/all')
        return tagList
    }

    static async edit(id, tag_name) {
        await put('tag/edit', {
            id,
            tag_name
        })
    }

    static async deleteTag(id) {
        await _delete('/tag/delete', { id })
    }
}