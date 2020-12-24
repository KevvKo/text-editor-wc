class TextEditor extends HTMLElement {

    constructor(){
        super();

        // Apply external styles to the shadow dom
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', './assets/css/style.css');

        this.template = document.createElement('template');
        this.attachShadow({mode: 'open'}); 
        this.shadowRoot.appendChild(link);
    }


    connectedCallback(){

        this.template.innerHTML = `
        
        <div id="text-editor" >
            <div id="toolbox">
                <span class="toolbox-button">
                    <img src="./assets/img/format_bold-black-24dp.svg">
                </span>
                <span class="toolbox-button">
                    <img src="./assets/img/format_italic-black-24dp.svg">
                </span>
                <span class="toolbox-button">
                    <img src="./assets/img/format_underlined-black-24dp.svg">
                </span>
                <span class="toolbox-button">    
                    <img src="./assets/img/format_list_bulleted-black-24dp.svg">
                </span>
                <span class="toolbox-button">
                    <img src="./assets/img/format_list_numbered-black-24dp.svg">
                </span>
            </div>
            <div id="content" contenteditable="true"></div>
        </div>`;

        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    };
}
customElements.define('text-editor', TextEditor)