import { writable } from "svelte/store"

export const createArticleStore = (data) => {
    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: "",
        category: "",
        sort: "",
        tag: ""
    })

    return {
        subscribe,
        set,
        update,
    }
}

export const filterHandler = (store) => {
    const searchTerm = store.search.toLowerCase() || ""
    const category = store.category.toLowerCase() || ""
    const tag = store.tag.toLowerCase() || ""

    store.filtered = store.data.filter((item) => {
        const hasSearch = item.searchTerms?.toLowerCase().includes(searchTerm);
        const hasCategory = item.categories?.toLowerCase().includes(category);
        const hasTag = item.searchTerms?.toLowerCase().includes(tag);

        return (hasSearch && hasCategory && hasTag)
    })
}