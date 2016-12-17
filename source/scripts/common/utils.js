export default {
    // Equivalent to jQuery's .live()
    live: (selector, eventType, handler, elementScope) => {
        (elementScope || document).addEventListener(eventType, function(event) {
            event.stopImmediatePropagation();

            let listeningTarget = event.target.closest(selector);
            if (listeningTarget) {
                handler.call(this, event, listeningTarget);
            }
        });
    },
    objectSize: (obj) => {
        let size = 0;
        
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
};
