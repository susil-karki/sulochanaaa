import { createWriteStream } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        
        const buffer = Buffer.concat(chunks);
        const fileName = `capture_${Date.now()}.jpg`;
        const filePath = join('/tmp', fileName);
        
        const writeStream = createWriteStream(filePath);
        writeStream.write(buffer);
        writeStream.end();
        
        res.status(200).json({ success: true, file: fileName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
