export default getTime = date => {
    const minutes = date.getMinutes();
    const hours = date.getHours();

    return `${hours <= 10 ? '0' : ''}${hours}:${minutes <= 10 ? '0' : ''}${minutes}`;
};