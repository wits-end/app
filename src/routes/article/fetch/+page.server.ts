import OpenAI from "openai";
import { parse } from 'node-html-parser'
import { OPENAI_KEY, OPENAI_VECTORSTORE_ID } from '$env/static/public'

const openai = new OpenAI({ apiKey: OPENAI_KEY });

async function aiAnalysis(pdf_url: string) {
    const assistant = await openai.beta.assistants.create({
        name: "Financial Analyst Assistant",
        instructions: "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
    });

    // For RAG upload paper pdf here
    // In the future
    const fileStreams = [pdf_url].map((path) =>
        fs.createReadStream(path),
    );

    // Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [OPENAI_VECTORSTORE_ID] } },
    });

    // Start a thread
    // A user wants to attach a file to a specific message, let's upload it.
    const pdf_file = await openai.files.create({
        file: fs.createReadStream(pdf_url),
        purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content:
                    "How many shares of AAPL were outstanding at the end of of October 2023?",
                // Attach the new file to the message.
                attachments: [{ file_id: pdf_file.id, tools: [{ type: "file_search" }] }],
            },
        ],
    });

    // Run the thread
    const stream = openai.beta.threads.runs
        .stream(thread.id, {
            assistant_id: assistant.id,
        })
        .on("textCreated", () => console.log("assistant >"))
        .on("toolCallCreated", (event) => console.log("assistant " + event.type))
        .on("messageDone", async (event) => {
            if (event.content[0].type === "text") {
                const { text } = event.content[0];
                const { annotations } = text;
                const citations: string[] = [];

                let index = 0;
                for (let annotation of annotations) {
                    text.value = text.value.replace(annotation.text, "[" + index + "]");
                    const { file_citation } = annotation;
                    if (file_citation) {
                        const citedFile = await openai.files.retrieve(file_citation.file_id);
                        citations.push("[" + index + "]" + citedFile.filename);
                    }
                    index++;
                }

                console.log(text.value);
                console.log(citations.join("\n"));
            }
        })
}

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
            const pdf_url = `https://arxiv.org/pdf/${id}${ver}.pdf`

            console.log(pdf_url)

            // Scrape data from raw HTML
            const title = dom.querySelector('.title').text.trim().split("Title:")[1]
            const authors = dom.querySelector('.authors').text.trim().split("Authors:")[1]
            const abstract = dom.querySelector('.abstract').text.trim().split("Abstract:")[1]
            const subjects = dom.querySelector('.subjects').text.trim()

            const summary = await aiAnalysis()


            console.log({ title, authors, abstract, subjects })
            console.log(summary)

        } catch (e) {
            console.log({ e })
        }
    }
};