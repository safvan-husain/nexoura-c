
import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'No file provided or invalid file type' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Remove background
        // We pass the buffer as a blob to the removeBackground function
        // @imgly/background-removal-node expects a URL, Blob, or ImageData
        // Since we are in Node environment, passing a Blob created from buffer might need a workaround or just passing the buffer if supported,
        // but the library documentation and our script suggests using Blob or URL.
        // In the script `scripts/remove-backgrounds.ts`, it uses `pathToFileURL`.
        // Here we have a buffer. We can try creating a Blob if Node version supports it (available in Node 18+ globally).

        // Note: The @imgly/background-removal-node library documentation says it accepts "string | Blob | ImageData".
        // Let's convert the buffer to a Blob.
        const inputBlob = new Blob([buffer], { type: file.type });

        const processedBlob = await removeBackground(inputBlob, {
            model: 'medium',
            output: {
                format: 'image/png',
                quality: 0.8,
            },
            // We don't need progress logging for API response
        });

        const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());

        // Upload to Cloudinary
        const result = await uploadImage(processedBuffer, 'nexoura-c/products');

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
        });

    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}
