import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

export const paginateQuery = async (array, page = 1, limit = 6) =>{
    const total = array.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const offset = (currentPage - 1) * limit;
    const paginatedItems = array.slice(offset, offset + limit);
    const leanItems = JSON.parse(JSON.stringify(paginatedItems));
    return {
        data: leanItems,
        page: currentPage,
        total,
        totalPages
    };
}

export function generateServiceId() {
  return `SRV-${uuidv4().slice(0, 8)}`; // VD: SRV-a1b2c3d4
}
