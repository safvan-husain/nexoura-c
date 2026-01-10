import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

let isConfigured = false;

function ensureConfig() {
    if (isConfigured) return;

    if (process.env.CLOUDINARY_URL) {
        try {
            const url = new URL(process.env.CLOUDINARY_URL);
            cloudinary.config({
                cloud_name: url.hostname,
                api_key: url.username,
                api_secret: url.password,
                secure: true,
            });
        } catch (err) {
            cloudinary.config({ secure: true });
        }
    } else {
        cloudinary.config({ secure: true });
    }
    isConfigured = true;
}

export interface CloudinaryResult {
    url: string;
    publicId: string;
    originalName: string;
}

/**
 * Uploads a single image to Cloudinary.
 * @param file - Base64 string, Buffer, or remote URL of the image.
 * @param folder - Optional folder name in Cloudinary.
 * @returns Promise with URL and public ID.
 */
export async function uploadImage(
    file: string | Buffer,
    folder: string = 'nexoura-c'
): Promise<CloudinaryResult> {
    ensureConfig();
    try {
        const options = {
            folder,
            resource_type: 'auto' as const,
        };

        const result: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result!);
                }
            );

            if (typeof file === 'string' && (file.startsWith('data:') || file.startsWith('http'))) {
                // If it's a data URL or a remote URL, we use the upload method
                cloudinary.uploader.upload(file, options)
                    .then(resolve)
                    .catch(reject);
            } else if (file instanceof Buffer) {
                uploadStream.end(file);
            } else {
                // Assume file is a path or base64 without prefix
                cloudinary.uploader.upload(file as string, options)
                    .then(resolve)
                    .catch(reject);
            }
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            originalName: result.original_filename || '',
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Uploads multiple images to Cloudinary.
 * @param files - Array of base64 strings, Buffers, or remote URLs.
 * @param folder - Optional folder name in Cloudinary.
 * @returns Promise with an array of results.
 */
export async function uploadImages(
    files: (string | Buffer)[],
    folder: string = 'nexoura-c'
): Promise<CloudinaryResult[]> {
    try {
        const uploadPromises = files.map((file) => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error);
        throw new Error('Failed to upload some images to Cloudinary');
    }
}

export default cloudinary;
