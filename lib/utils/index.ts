export function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter((input): input is string => typeof input === 'string' && input.length > 0).join(' ');
}
