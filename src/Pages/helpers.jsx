import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

const markdownToWordParagraphs = (markdown) => {
    const paragraphs = [];

    const processor = unified().use(remarkParse).use(remarkStringify);
    const markdownTree = processor.parse(markdown);

    visit(markdownTree, (node) => {
        if (node.type === 'text') {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: node.value,
                            bold: node.strong || false,
                            italics: node.emphasis || false,
                        }),
                    ],
                })
            );
        } else if (node.type === 'paragraph') {
            const children = [];
            node.children.forEach((child) => {
                if (child.type === 'text') {
                    children.push(
                        new TextRun({
                            text: child.value,
                            bold: child.strong || false,
                            italics: child.emphasis || false,
                        })
                    );
                }
            });

            paragraphs.push(new Paragraph({ children }));
        } else if (node.type === 'list') {
            node.children.forEach((listItem) => {
                const textRuns = listItem.children.map((listChild) =>
                    new TextRun({
                        text: listChild.value || '',
                    })
                );
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        bullet: {
                            level: 0,
                        },
                    })
                );
            });
        }
    });

    return paragraphs;
};

export const downloadWordDocument = (responses) => {
    const docSections = responses.map((response, index) => {
        const paragraphs = [
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Lesson Plan ${index + 1}`,
                        bold: true,
                        size: 28, // Larger title size
                    }),
                ],
            }),
            new Paragraph({
                text: `Prompt: ${response.prompt}`,
            }),
            new Paragraph({
                text: `Grade Level: ${response.grade_level}`,
            }),
            new Paragraph({
                text: `Topic: ${response.topic}`,
            }),
            ...markdownToWordParagraphs(response.content), // Convert Markdown to Word paragraphs
            new Paragraph({ text: '---' }),
        ];
        return { properties: {}, children: paragraphs };
    });

    const doc = new Document({
        sections: docSections,
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, 'LessonPlans.docx');
    });
};

