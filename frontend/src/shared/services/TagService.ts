import { Tag } from "../interfaces/Tag"
import httpClient from "../utils/httpClient"

const createTag = async (tag: Tag) => {
    return httpClient.post('/tags', tag)
}

const getTags = async () => {
    return httpClient.get('/tags')
}

const getTag = async (id: string) => {
    return httpClient.get(`/tags/${id}`)
}

const updateTag = async (id: string, tag: Tag) => {
    return httpClient.put(`/tags/${id}`, tag)
}

const deleteTag = async (id: string) => {
    return httpClient.delete(`/tags/${id}`)
}

const addTagToUrl = async (tagId: string, urlId: string) => {
    return httpClient.post(`/tags/${tagId}/urls/${urlId}`)
}

const TagService = {
    createTag,
    getTags,
    getTag,
    updateTag,
    deleteTag,
    addTagToUrl
}

export default TagService;