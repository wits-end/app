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
        console.log("Hello World")

        const abs_url = 'https://arxiv.org/abs/2202.11782'
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
            const arxiv_id = "1706.03762"
            const url = `http://export.arxiv.org/api/query?search_query=id:${arxiv_id}&max_results=1`
            const res = await fetch(url)
            const content = await res.text()

            const parser = new XMLParser();
            let data = parser.parse(content);

            console.log(data)

            // const dom = parse(content)
            const [id, ver] = parseArxivUrl(abs_url)
            const pdf_url = `https://arxiv.org/pdf/2202.11782`

            console.log(pdf_url)

            // Scrape data from raw HTML
            // const title = dom.querySelector('.title').text.trim().split("Title:")[1]
            // const authors = dom.querySelector('.authors').text.trim().split("Authors:")[1]
            // const abstract = dom.querySelector('.abstract').text.trim().split("Abstract:")[1]
            // const subjects = dom.querySelector('.subjects').text.trim()

            // const summary = await aiAnalysis(pdf_url, title)


            // console.log({ title, authors, abstract, subjects })
            // console.log(summary)

        } catch (e) {
            console.log({ e })
        }
    }
};