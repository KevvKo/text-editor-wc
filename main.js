class TextEditor extends HTMLElement    {

    constructor(){
        super();

        const template = document.createElement("template");
        template.id = "text-editor";

        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));


    }
}

customElements.define('text-editor', TextEditor)
