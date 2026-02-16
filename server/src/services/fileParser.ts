
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export const parseFile = async (file: any): Promise<string> => {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } else if (extension === 'docx') {
        const result = await mammoth.extractRawText({ path: file.path });
        return result.value;
    } else {
        throw new Error(`Unsupported file type: ${extension}`);
    }
};
