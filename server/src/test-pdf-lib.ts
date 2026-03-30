
import { PDFParse } from 'pdf-parse';
import fs from 'fs';

async function test() {
    try {
        console.log('PDFParse type:', typeof PDFParse);
        // We don't have a real PDF here easily, but we can check if it throws on constructor
        try {
            const parser = new PDFParse({ data: Buffer.from('%PDF-1.4') });
            console.log('Instance created');
        } catch (e) {
            console.log('Constructor failed:', e instanceof Error ? e.message : e);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
