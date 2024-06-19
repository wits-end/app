import { writable } from "svelte/store"

export const createArticleStore = (data) => {
    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: "",
        category: "",
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

    store.filtered = store.data.filter((item) => {
        const isSearch = item.searchTerms?.toLowerCase().includes(searchTerm);
        const isCategory = item.categories?.toLowerCase().includes(category);
        return (isSearch && isCategory)
    })
}