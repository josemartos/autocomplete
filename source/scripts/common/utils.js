export default {    
    objectSize: obj => {
        let size = 0;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },

    escapeRegExp: str => {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
};
