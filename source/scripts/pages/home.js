import {AutoComplete} from "autoComplete";

const autoComplete = new AutoComplete({
    el: 'js-autocomplete',
    source: 'https://jsonplaceholder.typicode.com/users'
});

if (autoComplete.el) { autoComplete.init(); }