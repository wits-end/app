import { writable } from "svelte/store"


export const createArticleStore = (data) => {
    data = data.map((article) => ({
        ...article,
        searchTerms: `${article.title} ${article.authors} ${article.abstract} ${article.keywords}`
    }));

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: "",
        category: "",
        sort: "",
        time: "",
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
    const category = store.category == "all" ? "" : (store.category.toLowerCase() || "")
    const tag = store.tag == "all" ? "" : (store.tag.toLowerCase() || "")

    const sort = store.sort.toLowerCase() || ""

    const time = store.time.toLowerCase() || ""

    const currentTime = new Date()
    let timeThreshold = new Date()

    if (time == "pastfive") {
        timeThreshold.setFullYear(currentTime.getFullYear() - 5)

    } else if (time == "pastyear") {
        timeThreshold.setFullYear(currentTime.getFullYear() - 1)

    } else if (time == "pastmonth") {
        timeThreshold.setMonth(currentTime.getMonth() - 1)
    }


    store.filtered = store.data.filter((item) => {
        const hasSearch = item.searchTerms?.toLowerCase().includes(searchTerm);
        const hasCategory = item.categories?.toLowerCase().includes(category);
        const hasTag = item.searchTerms?.toLowerCase().includes(tag);
        const withinTime = time == "alltime" ? true : new Date(item.published_at) > timeThreshold;

        console.log(item.published_at)
        console.log(timeThreshold)
        console.log(withinTime)

        return (hasSearch && hasCategory && hasTag && withinTime)
    })
}