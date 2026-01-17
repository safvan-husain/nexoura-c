'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Button } from '@/components/ui/Button';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}

export const ImageCropper = ({ image, onCropComplete, onCancel }: ImageCropperProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            if (!url.startsWith('data:')) {
                image.setAttribute('crossOrigin', 'anonymous');
            }
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleApply = async () => {
        if (!croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="relative h-96 w-full bg-slate-900 rounded-lg overflow-hidden">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={onCropChange}
                    onCropComplete={onCropAreaComplete}
                    onZoomChange={onZoomChange}
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <label>Zoom (Scale)</label>
                        <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="flex justify-between gap-4 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => setZoom(Math.max(1, zoom - 0.1))}>
                            Scale Down
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                            Scale Up
                        </Button>
                        <Button type="button" onClick={handleApply}>
                            Apply Crop
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
