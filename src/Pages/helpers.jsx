import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import markdownToTxt from 'markdown-to-txt';

export const downloadWordDocument = (responses) => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: responses.flatMap((response, index) => [
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
                    new Paragraph({
                        text: markdownToTxt(response.content), // Converts Markdown to plain text
                    }),
                    new Paragraph({ text: '---' }),
                ]),
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, 'LessonPlans.docx');
    });
};
