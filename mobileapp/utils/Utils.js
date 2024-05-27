export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const loadMore = ({ nativeEvent, loading, page, setPage }) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
        setPage(page + 1);
    }
};

export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

export const getFirstDayOfMoth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMoth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
