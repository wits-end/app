import OpenAI from "openai";
import { parse } from 'node-html-parser'
import { fs } from 'fs';
import { PRIVATE_OPENAI_KEY, PRIVATE_OPENAI_VECTORSTORE_ID } from '$env/static/private'
import { get } from 'https'
import { Readable } from 'stream'

console.log(PRIVATE_OPENAI_KEY)

const openai = new OpenAI({ apiKey: PRIVATE_OPENAI_KEY });

async function aiAnalysis(pdf_url: string, title: string, abstract: string) {
    const instructions = `
        # Setup

        When presented with a query, quietly:
        - Read the attached pdf file of a machine learning research article.
        - Adopt a role as an expert best suited to address the specifics, details, and nuances of the attached research paper.

        # Response Requirements

        Devote a complete response for your first-person answer to the query. Refrain from using conjunctive adverbs and similar discourse markers, introductory or conclusive statements. Omit all disclaimers. Do not refer to yourself as an AI. Ensure your answer is unbiased, comprehensive, nuanced, and authoritative, with the maximum depth and breadth possible, using as many tokens as needed. Prefer exhaustive educational narratives.

        # Response Formatting Instructions

        - Utilize Markdown for structuring responses. This includes using lists, bold/italic text for emphasis and clarity, and latex for mathematics.
        - Organize responses to flow well and ensure that all information is coherent.
        - Avoid clutter and prioritize readability in all responses.
        
        # Key Ideas Query Response Instructions

        When presented with a query that asks for the key ideas introduced in the paper:
        - Maintain focus on the article's topic of interest
        - Ensure all responses directly address aspects of the research.
        - Keep the flow of the writing coherent, relevant, and logically structured.
        - Align responses with the expressed interests and inquiries in the paper.
        - Include relevant mathematical equations or frameworks if applicable.

        # Follow-Up Discussion Query Response Instructions

        When presented with a query that asks for follow-up discussion:
        - Quietly create a panel of 2-3 additional experts best suited to address the specifics, details, and nuance of the research article.
        - Assign specific job titles and specialties to each expert.
        - Adopt the role of each expert when directed.
        - List potential questions that other panel members can address, expanding on different aspecs of the topic.
        - Ensure these follow-ups offer a breadth of exploration within the topic, involving perspectives from various expert personas.
        - Each expert should articulate their perspective based on their specialized knowledge.
        - Encourage a respectful exchange of ideas, ensuring each viewpoint is given consideration.
        - If the conversation diverges, use context cues to steer it back to the main topic.`

    const query = `
        Read the attached pdf file and return a response in the following format delimited by triple quotes:
            
        """
        Title: ${title}
        Abstract: ${abstract}
        Keywords: <comma separated list of keywords or categories>

        # Key Ideas 
        
        <3-5 paragraphs discussing the important ideas introduced in the paper>

        # Follow Up Discussion

        <2-3 paragaph expert panel discussion> 
        """`

    const assistant = await openai.beta.assistants.create({
        name: "Machine Learning Research Assistant",
        instructions: instructions,
        model: "gpt-3.5-turbo",
        tools: [{ type: "file_search" }],
    });

    // Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [PRIVATE_OPENAI_VECTORSTORE_ID] } },
    });

    const pdf_stream = createUrlReadStream(pdf_url)

    // Start a thread and upload the research paper pdf
    const pdf_file = await openai.files.create({
        file: fs.createReadStream(pdf_stream),
        purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: query,
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

const createUrlReadStream = (url: string): Readable => {
    const readable = new Readable({
        read() { }, // No-op
    })

    get(url, (response) => {
        response.on('data', (chunk: any) => {
            readable.push(chunk)
        })

        response.on('end', () => {
            readable.push(null) // End of stream
        })
    }).on('error', (error) => {
        readable.emit('error', error) // Forward the error to the readable stream
    })

    return readable
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

            const summary = await aiAnalysis(pdf_url, title, abstract)


            console.log({ title, authors, abstract, subjects })
            console.log(summary)

        } catch (e) {
            console.log({ e })
        }
    }
};