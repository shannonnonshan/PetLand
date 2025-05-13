import dotenv from 'dotenv';

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
