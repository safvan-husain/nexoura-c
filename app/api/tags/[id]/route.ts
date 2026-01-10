import { handleGetTag, handleUpdateTag, handleDeleteTag } from '@/lib/tag/tag.controller';

export const GET = handleGetTag;
export const PUT = handleUpdateTag;
export const DELETE = handleDeleteTag;
