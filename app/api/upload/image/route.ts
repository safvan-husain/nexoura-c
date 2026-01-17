
import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        console.log('[API/upload/image] POST request received');
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof Blob)) {
            console.error('[API/upload/image] No valid file provided');
            return NextResponse.json(
                { error: 'No file provided or invalid file type' },
                { status: 400 }
            );
        }

        console.log('[API/upload/image] Processing file:', (file as any).name, 'size:', file.size, 'type:', file.type);
        const buffer = Buffer.from(await file.arrayBuffer());

        // Remove background
        console.log('[API/upload/image] Attempting background removal...');
        const inputBlob = new Blob([buffer], { type: file.type });

        try {
            const processedBlob = await removeBackground(inputBlob, {
                model: 'medium',
                output: {
                    format: 'image/png',
                    quality: 0.8,
                },
            });

            const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());
            console.log('[API/upload/image] Background removed. Processed size:', processedBuffer.length);

            // Upload to Cloudinary
            console.log('[API/upload/image] Uploading to Cloudinary...');
            const result = await uploadImage(processedBuffer, 'nexoura-c/products');
            console.log('[API/upload/image] Cloudinary upload successful:', result.url);

            return NextResponse.json({
                url: result.url,
                publicId: result.publicId,
            });
        } catch (bgError) {
            console.error('[API/upload/image] Background removal failed:', bgError);
            return NextResponse.json(
                { error: 'Background removal is mandatory and failed. Please try a different image or try again.' },
                { status: 422 }
            );
        }

    } catch (error) {
        console.error('[API/upload/image] Error processing image:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}
