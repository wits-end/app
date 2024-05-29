import OpenAI from "openai";
import fs from 'fs';
import https from 'https';
import { parse } from 'node-html-parser';
import { PRIVATE_OPENAI_KEY, PRIVATE_OPENAI_ASSISTANT_ID } from '$env/static/private';
import { fromPath } from "pdf2pic";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const openai = new OpenAI({ apiKey: PRIVATE_OPENAI_KEY });

async function aiAnalysis(pdf_url: string, title: string) {
    const query = `
        Return a response in the following format delimited by triple quotes:
        
        """
        Title: ${title}

        Keywords: <comma separated list of keywords or categories>

        # Key Ideas 

        <3-5 paragraphs summarizing the important ideas introduced and explored in the research paper>
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
        { assistant_id: PRIVATE_OPENAI_ASSISTANT_ID, stream: true }
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

            const absUrl = `https://https://arxiv.org/abs/${arxivId}`
            const pdfUrl = `https://https://arxiv.org/pdf/${arxivId}`
            const apiUrl = `https://export.arxiv.org/api/query?search_query=id:${arxivId}&max_results=1`

            const res = await fetch(apiUrl)
            const content = await res.text()

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });

            let { feed: { entry: data } } = parser.parse(content);

            console.log(data)

            const updatedAt = data.updated
            const publishedAt = data.published
            const title = data.title
            const summary = data.summary.replace(/\n/g, " ")
            const authors = data.author.map(x => x["name"])
            const categories = data.category.map(x => x["@_term"])


            // const analysis = await aiAnalysis(pdfUrl, title)


            console.log({ absUrl, pdfUrl, updatedAt, publishedAt, title, summary, authors, categories })
            // console.log(analysis)

        } catch (e) {
            console.log({ e })
        }
    }
};