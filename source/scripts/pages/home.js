import { AutoComplete } from "../common/auto-complete";

const autoComplete = new AutoComplete({
    el: 'js-autocomplete',
    sourceApi: 'https://jsonplaceholder.typicode.com/users'
});

if (autoComplete.el) { autoComplete.init(); }