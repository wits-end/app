import OpenAI from "openai";
import fs from 'fs';
import https from 'https';
import { parse } from 'node-html-parser';
import { PRIVATE_OPENAI_KEY, PRIVATE_OPENAI_VECTORSTORE_ID } from '$env/static/private';
import { fromPath } from "pdf2pic";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const openai = new OpenAI({ apiKey: PRIVATE_OPENAI_KEY });

async function aiAnalysis(pdf_url: string, title: string) {
    const query = `Read the attached pdf file and return a response in the following format delimited by triple quotes:
    
"""
Title: ${title}

Keywords: <comma separated list of keywords or categories>

# Key Ideas 

<3-5 paragraphs discussing the important ideas introduced in the paper>
"""`

    console.log(query)

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: query,
                // attachments: [{ file_id: pdf_file.id, tools: [{ type: "file_search" }] }],
                // attachments: [{ file_id: "file-7a5Lk4aGOXvim22OlWlyg0wl", tools: [{ type: "file_search" }] }],
            },
        ],
    });

    const stream = await openai.beta.threads.runs.create(
        thread.id,
        { assistant_id: "asst_nqtsYif6glV1ztlWPBCMj4cJ", stream: true }
    );

    for await (const event of stream) {
        console.log(event);
    }

}

function getPdfImages() {
    const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./images",
        format: "jpg",
        width: 180,
        height: 256
    };
    const convert = fromPath("/path/to/pdf/sample.pdf", options);
    const pageToConvertAsImage = 1;

    convert(pageToConvertAsImage, { responseType: "image" })
        .then((resolve) => {
            console.log("Page 1 is now converted as image");

            return resolve;
        });
}

export const actions = {
    default: async (event) => {
        try {
            const arxivId = "1706.03762"
            const apiUrl = `http://export.arxiv.org/api/query?search_query=id:${arxivId}&max_results=1`
            const res = await fetch(apiUrl)
            const content = await res.text()

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });

            let { feed: { entry: data } } = parser.parse(content);

            console.log(data)

            const updated_at = data.updated
            const published_at = data.published
            const title = data.title
            const summary = data.summary.replace(/\n/g, " ")
            const authors = data.author.map(x => x["name"])
            const categories = data.category.map(x => x["@_term"])

            // const dom = parse(content)
            // const [id, ver] = parseArxivUrl(abs_url)
            // const pdf_url = `https://arxiv.org/pdf/2202.11782`

            // console.log(pdf_url)

            // Scrape data from raw HTML
            // const title = dom.querySelector('.title').text.trim().split("Title:")[1]
            // const authors = dom.querySelector('.authors').text.trim().split("Authors:")[1]
            // const abstract = dom.querySelector('.abstract').text.trim().split("Abstract:")[1]
            // const subjects = dom.querySelector('.subjects').text.trim()

            // const summary = await aiAnalysis(pdf_url, title)


            console.log({ updated_at, published_at, title, summary, authors, categories })
            // console.log(summary)

        } catch (e) {
            console.log({ e })
        }
    }
};