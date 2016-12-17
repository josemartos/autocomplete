import axios from "axios";
import utils from "utils";

export class AutoComplete {

    constructor (options) {
        let suggestions;

        this.el = document.getElementById(options.el);
        this.sourceApi = options.sourceApi;

        this.source = '';
        this.listSuggestions = {};
        this.suggestionPosition = -1;
        this.timeout = null;
        this.delay = 200;
        this.activeClass = 'is-active';
        this.selectedClass = 'is-selected';

        suggestions = document.createElement('div');
        suggestions.className = 'js-autocomplete-suggestions autocomplete-suggestions';
        this.el.appendChild(suggestions);
        this.suggestionsContainer = this.el.querySelector('.js-autocomplete-suggestions');
        this.entryInput = this.el.querySelector('input[type=text]');
    }

    init () {
        // Get all items
        axios.get(this.sourceApi).then(response => {
            this.source = response.data;
        });

        // Events
        this.handleEvent(this.entryInput, 'keyup', this.handleSearch);
    }

    // Helpers
    handleEvent (element, eventType, callBack) {
        element.addEventListener(eventType, event => {
            event.stopImmediatePropagation();
            callBack.call(this, event);
        });
    }

    // Highlights the written part on the suggestion
    renderSuggestion (str, index, replacement) {
        let replacementLength = replacement.length,
            bold = "<b>" + str.substr(index, replacementLength) + "</b>";

        return str.substr(0, index) + bold + str.substr(index + replacementLength, str.length);
    }

    // Main
    doSearch (event) {
        let query = utils.escapeRegExp(event.target.value),
                    queryLower = query.toLowerCase(),
                    sourceLength = utils.objectSize(this.source),
                    suggestions = '',
                    cont = 0;

        // Saves the query globally
        this.query = query;

        this.resetSuggestions();

        if (query === "") {
            this.hideSuggestions();
            return;
        }

        // String finder
        for (let i = 0, len = sourceLength; i < len; i++) {
            let element = this.source[i].name,
                elementLower = element.toLowerCase(),
                entryIndex = elementLower.indexOf(queryLower);

            // The string is into the element
            if (entryIndex !== -1) {
                let suggestion = this.renderSuggestion(element, entryIndex, query);

                suggestions += `<li data-suggestion-id='${cont}' data-suggestion-content="${element}" class="js-autocomplete-suggestion autocomplete-suggestion">${suggestion}</li>`;
                cont = cont + 1;
            }
        }

        if (suggestions) {
            // Shows suggestions
            this.suggestionsContainer.classList.add(this.activeClass);
            this.suggestionsContainer.innerHTML = "<ul>" + suggestions + "</ul>";

            // Saves all the suggestions
            // [...] spread operator transforms the nodeList into an array
            this.listSuggestions = [...this.suggestionsContainer.querySelectorAll('.js-autocomplete-suggestion')];
        } else {
            this.hideSuggestions();
        }
    }

    handleSearch (event) {
        let key =  event.keyCode || event.which,
            query = event.target.value;

        // esc 27, enter 13, 35 - 40 arrows
        if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {

            if (this.timeout !== null) {
                clearTimeout(this.timeout);
            }

            // Little delay
            this.timeout = setTimeout(() => {
                this.doSearch(event);
            }, this.delay);
        }

        // 38 up, 40 down
        if (key === 38 || key === 40) {
            let suggestionsLength = this.listSuggestions.length - 1;

            if (this.suggestionPosition === -1 && query !== "") {
                this.resetSearch();
                this.doSearch(event);
            }

            if (suggestionsLength >= 0) {
                if (key === 40) {
                    this.suggestionPosition = this.suggestionPosition + 1;
                }

                if (key === 38 && this.suggestionPosition === -1) {
                    this.suggestionPosition = this.listSuggestions.length - 1;
                } else if (key === 38) {                    
                    this.suggestionPosition = this.suggestionPosition - 1;
                }

                // Validate and see if the index is between the suggestions
                // Otherwise it focus again inside the input
                if ((key === 38 && this.suggestionPosition < 0) || (key === 40 && this.suggestionPosition > suggestionsLength)) {
                    this.suggestionPosition = -1;
                    this.deselectSuggestions();
                    return;
                }

                this.deselectSuggestions();
                this.selectSuggestion();
            }
        }

        // 13 enter
        if (key === 13) {
            this.hideSuggestions();
            this.resetSuggestions();
        }

        // 27 esc
        if (key === 27) {
            this.deselectSuggestions();
            this.suggestionPosition = -1;
        }
    }

    resetSearch () {
        this.entryInput.value = this.query;
    }

    selectSuggestion () {
        let suggestion = this.el.querySelector('[data-suggestion-id="' + this.suggestionPosition + '"]');

        suggestion.classList.add(this.selectedClass);
        this.entryInput.value = suggestion.getAttribute('data-suggestion-content');
    }

    deselectSuggestions () {
        this.listSuggestions.forEach(item => {
            item.classList.remove(this.selectedClass);
        });
        this.resetSearch();
    }

    hideSuggestions () {
        this.suggestionsContainer.classList.remove(this.activeClass);
    }

    resetSuggestions () {
        this.listSuggestions = {};
        this.suggestionsContainer.innerHTML = "";
        this.suggestionPosition = -1;
    }
}
