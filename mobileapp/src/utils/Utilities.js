export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

export const getFirstDayOfYear = (date) => {
    return new Date(date.getFullYear(), 0, 1);
};

export const getLastDayOfYear = (date) => {
    return new Date(date.getFullYear(), 11, 31);
};
