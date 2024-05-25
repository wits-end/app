import OpenAI from "openai";
import { parse } from 'node-html-parser'

const openai = new OpenAI();

async function main() {
    const assistant = await openai.beta.assistants.create({
        name: "Financial Analyst Assistant",
        instructions: "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
    });

    // For RAG upload paper pdf here
    const fileStreams = ["edgar/goog-10k.pdf", "edgar/brka-10k.txt"].map((path) =>
        fs.createReadStream(path),
    );

    // Create a vector store including our two files.
    let vectorStore = await openai.beta.vectorStores.create({
        name: "Financial Statement",
    });

    // Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    // Start a thread
    // A user wants to attach a file to a specific message, let's upload it.
    const aapl10k = await openai.files.create({
        file: fs.createReadStream("edgar/aapl-10k.pdf"),
        purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content:
                    "How many shares of AAPL were outstanding at the end of of October 2023?",
                // Attach the new file to the message.
                attachments: [{ file_id: aapl10k.id, tools: [{ type: "file_search" }] }],
            },
        ],
    });

    // The thread now has a vector store in its tool resources.
    console.log(thread.tool_resources?.file_search);

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
        }
    }
}

main();

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