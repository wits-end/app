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

export const searchHandler = (store) => {
    const searchTerm = store.search.toLowerCase() || ""

    store.filtered = store.data.filter((item) => {
        return item.searchTerms.toLowerCase().includes(searchTerm);
    })
}

export const categoryHandler = (store) => {
    const category = store.category.toLowerCase() || ""

    store.filtered = store.data.filter((item) => {
        return item.categories?.toLowerCase().includes(category);
    })
}