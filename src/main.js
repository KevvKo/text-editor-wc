class TextEditor extends HTMLElement {

    constructor(){
        super();

        this.template = document.createElement('template');
        this.attachShadow({mode: 'open'}); 
    }

    connectedCallback(){

        this.template.innerHTML = `
        <style>

            #text-editor{
                width: 500px;
                height: 350px;
                display: flex;
                border-radius: 5px;
                border: 1px solid #D2D2D2; 
            }

            #content{
                height: 100%;
                width: 100%;
            }
        </style>
        <div id="text-editor" >
            <div id="toolbox">
            </div>
            <div id="content" contenteditable="true"></div>
        </div>`;

        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    };
}
customElements.define('text-editor', TextEditor)