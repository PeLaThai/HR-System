import config from "../config";

export const getPaginInfor = (req) => {
    const pageIndex = parseInt(req.query.pageIndex) || config.query_default_page_index;
    const pageSize = parseInt(req.query.pageSize) || config.query_default_page_size;
    return { pageIndex, pageSize }
}