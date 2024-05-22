import xml2js from "xml2js"

const parser = new xml2js.Parser()

const url = 'http://export.arxiv.org/api/query?search_query=cat:cs.CV+OR+cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL+OR+cat:cs.NE+OR+cat:stat.ML&start=0&max_results=10'

try {
    const res = await fetch(url)
    const content = await res.text()
    const data = await parser.parseStringPromise(content)

    console.log({ data })
} catch (e) {
    console.log({ e })
}

export { }