import { writable } from "svelte/store"


export const createArticleStore = (data) => {
    data = data.map((article) => ({
        ...article,
        searchTerms: `${article.title} ${article.authors} ${article.abstract} ${article.keywords} ${article.arxiv_id}`
    }));

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: "",
        category: "",
        sort: "",
        time: "",
        tag: "",
        page: 0
    })

    return {
        subscribe,
        set,
        update,
    }
}

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1

    return { from, to }
}

export const filterHandler = (store) => {
    const searchTerm = store.search.toLowerCase() || ""
    const category = store.category == "all" ? "" : (store.category.toLowerCase() || "")
    const tag = store.tag == "all" ? "" : (store.tag.toLowerCase() || "")
    const sort = store.sort.toLowerCase() || ""
    const time = store.time.toLowerCase() || ""
    const { from, to } = getPagination(store.page, 15)

    let timeThreshold = new Date()

    if (time == "pastfive") {
        timeThreshold.setFullYear(timeThreshold.getFullYear() - 5)
    } else if (time == "pastthree") {
        timeThreshold.setFullYear(timeThreshold.getFullYear() - 3)
    } else if (time == "pastyear") {
        timeThreshold.setFullYear(timeThreshold.getFullYear() - 1)
    }

    store.filtered = store.data.filter((item) => {
        const hasSearch = item.searchTerms?.toLowerCase().includes(searchTerm);
        const hasCategory = item.categories?.toLowerCase().includes(category);
        const hasTag = item.searchTerms?.toLowerCase().includes(tag);
        const withinTime = time == "alltime" ? true : new Date(item.published_at) > timeThreshold;

        return (hasSearch && hasCategory && hasTag && withinTime)
    })

    if (sort == "recent") {
        store.filtered.sort((a, b) => {
            return a.published_at < b.published_at
        })
    } else if (sort == "featured") {
        store.filtered.sort((a, b) => {
            return a.featured_at < b.featured_at
        })
    } else if (sort == "influential") {
        store.filtered.sort((a, b) => {
            return a.citations < b.citations
        })
    } else if (sort == "foryou") {
        store.filtered.sort((a, b) => {
            if (a.similarity && b.similarity) {
                return a.similarity < b.similarity
            }
            else {
                return a.citations < b.citations
            }
        })
    }

    store.filtered = store.filtered.slice(from, to)
}