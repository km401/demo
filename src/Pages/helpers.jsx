import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const downloadWordDocument = (responses) => {
    const zip = new JSZip();
    const doc = zip.folder("Lesson Plans");

    responses.forEach((response, index) => {
        const content = `
            **Prompt:** ${response.prompt}\n
            **Grade Level:** ${response.grade_level}\n
            **Topic:** ${response.topic}\n\n
            ${response.content}
        `;

        doc.file(`LessonPlan_${index + 1}.docx`, content);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "LessonPlans.zip");
    });
};