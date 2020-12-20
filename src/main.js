class TextEditor extends HTMLElement {

    connectedCallback(){
       this.innerHTML = '<div id="text-editor"></div>' 
    };
}
customElements.define('text-editor', TextEditor)