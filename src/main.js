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
                flex-direction: column;
                border-radius: 5px;
                border: 1px solid #D2D2D2; 
            }

            #toolbox{
                
            }

            #content{
                flex-grow: 2;
            }

        </style>
        <div id="text-editor" >
            <div id="toolbox">
                <img src="./assets/img/format_bold-black-24dp.svg">
                <img src="./assets/img/format_italic-black-24dp.svg">
                <img src="./assets/img/format_underlined-black-24dp.svg">
                <img src="./assets/img/format_list_bulleted-black-24dp.svg">
                <img src="./assets/img/format_list_numbered-black-24dp.svg">
            </div>
            <div id="content" contenteditable="true"></div>
        </div>`;

        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    };
}
customElements.define('text-editor', TextEditor)