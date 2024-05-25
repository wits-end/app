import { parse } from 'node-html-parser'

export const actions = {
    default: async (event) => {
        console.log("Hello World")

        const abs_url = 'https://arxiv.org/abs/2311.14101'
        // const abs_url = 'https://arxiv.org/abs/1706.03762v6'

        // Pull raw id and version from abs urls:
        // https://arxiv.org/abs/2311.14101
        // https://arxiv.org/abs/1706.03762v6
        function parseArxivUrl(abs_url: string): [string, string] {
            let idx = abs_url.lastIndexOf('/')
            let slug = abs_url.substring(idx + 1)
            let data: [string, string] = slug.includes('v')
                ? [slug.split('v')[0], "v" + slug.split('v')[1]]
                : [slug, "v1"]

            return data
        }

        try {
            const res = await fetch(abs_url)
            const content = await res.text()
            const dom = parse(content)
            const [id, ver] = parseArxivUrl(abs_url)
            const pdf_url = `https://arxiv.org/pdf/${id}${ver}`

            console.log(pdf_url)

            // Scrape data from raw HTML
            const title = dom.querySelector('.title').text.trim().split("Title:")[1]
            const authors = dom.querySelector('.authors').text.trim().split("Authors:")[1]
            const abstract = dom.querySelector('.abstract').text.trim().split("Abstract:")[1]
            const subjects = dom.querySelector('.subjects').text.trim()

            console.log({ title, authors, abstract, subjects })
        } catch (e) {
            console.log({ e })
        }
    }
};