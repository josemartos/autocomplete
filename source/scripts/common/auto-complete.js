import axios from "axios";
import utils from "utils";

export class AutoComplete {
    constructor (options) {
        this.el = document.getElementById(options.el);
        this.sourceApi = options.source;

        this.source = '';

        this.entryInput = this.el.querySelector('.js-autocomplete-input');
        this.suggestionsContainer = this.el.querySelector('.js-autocomplete-suggestions');
    }

    init () {
        // Get all data
        axios.get(this.sourceApi)
        .then(response => {
            this.source = response.data;
        });          
        
        // Events
        this.handleEvent(this.entryInput, 'keyup', this.handleEntry);
    }

    // Helpers
    handleEvent (element, eventType, callBack) {
        element.addEventListener(eventType, event => {
            event.stopImmediatePropagation();
            callBack.call(this, event);
        });
    }

    // Main
    handleEntry (event) {
        let key = event.keyCode,
            input = event.target;

        if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
            let entry = input.value,
                entryLength = entry.length,
                suggestions = '';

            // Empty suggestions
            this.suggestionsContainer.innerHTML = '';

            if (entry === "") { return; }

            for (let i = 0, length = utils.objectSize(this.source); i < length; i++) {
                let element = this.source[i].name,
                    elementIndex = element.indexOf(entry);

                if (elementIndex !== -1) {
                    let suggestion = element.substring(0, elementIndex) +
                        "<b>" + element.substring(elementIndex, elementIndex + entryLength) + "</b>" +
                        element.substring(elementIndex + entryLength);
                    
                    suggestions += '<li>' + suggestion + '</li>';
                }
            }

            this.suggestionsContainer.innerHTML = '<ul>' + suggestions + '</ul>';
        }       
    }
}
