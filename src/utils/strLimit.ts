const strLimit = (str: string, maxLength: number, ending: string = "...") => {
    if (str.length > maxLength) return `${str.slice(0, maxLength)}${ending}`;
    return str;
};

export default strLimit;
