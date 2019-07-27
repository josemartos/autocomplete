export default {    
    objectSize: obj => {
        let size = 0;
        for (let key in obj) {
            let hasKey = Object.prototype.hasOwnProperty.call(obj, key);
            
            if (hasKey) {
                size++
            }
        }
        return size;
    },

    // Escape special characters
    escapeRegExp: str => {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
};
