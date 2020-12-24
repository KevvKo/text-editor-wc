class TextEditor extends HTMLElement {

    constructor(){
        super();

        //inline html template
        const template = document.createElement('div');
        template.setAttribute('id', 'text-editor');

        const toolbox = document.createElement('div');
        toolbox.setAttribute('id', 'toolbox');

        const textbox = document.createElement('div');
        textbox.setAttribute('id', 'content');
        textbox.setAttribute('contentEditable', true);
        
        //create the spans and button
        const boldButton = document.createElement('span');
        boldButton.setAttribute('class', 'toolbox-button');

        const italicButton = document.createElement('span');
        italicButton.setAttribute('class', 'toolbox-button');

        const underlinedButton = document.createElement('span');
        underlinedButton.setAttribute('class', 'toolbox-button');

        const unorderedButton = document.createElement('span');
        unorderedButton.setAttribute('class', 'toolbox-button');

        const orderedButton = document.createElement('span');
        orderedButton.setAttribute('class', 'toolbox-button');

        //create the images
        const imageBold = document.createElement('img')
        imageBold.src = "./assets/img/format_bold-black-24dp.svg"
        
        const imageItalic = document.createElement('img');
        imageItalic.src = "./assets/img/format_italic-black-24dp.svg";

        const imageUnderlined = document.createElement('img');
        imageUnderlined.src = "./assets/img/format_underlined-black-24dp.svg";

        const imageUnorderedList = document.createElement('img');
        imageUnorderedList.src = "./assets/img/format_list_bulleted-black-24dp.svg";

        const imageOrderedList = document.createElement('img');
        imageOrderedList.src = "./assets/img/format_list_numbered-black-24dp.svg";   

        const shadow = this.attachShadow({mode: 'open'}); 

        //external css link
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', './assets/css/style.css');
                
        //append all childs to the shadow DOM
        shadow.appendChild(link);
        shadow.appendChild(template);

        template.appendChild(toolbox);

        toolbox.appendChild(boldButton);
        toolbox.appendChild(italicButton);
        toolbox.appendChild(underlinedButton);
        toolbox.appendChild(unorderedButton);
        toolbox.appendChild(orderedButton);

        boldButton.appendChild(imageBold);
        italicButton.appendChild(imageItalic);
        underlinedButton.appendChild(imageUnderlined);
        unorderedButton.appendChild(imageUnorderedList);
        orderedButton.appendChild(imageOrderedList);

        template.appendChild(textbox);
    }
}
customElements.define('text-editor', TextEditor)