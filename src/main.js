class TextEditor extends HTMLElement {

    constructor(){
        super();

        //inline html template
        const template = document.createElement('div');
        template.setAttribute('id', 'text-editor');

        const toolbox = document.createElement('div');
        toolbox.setAttribute('id', 'toolbox');

        const textbox = document.createElement('textarea');
        textbox.setAttribute('id', 'content');
        textbox.setAttribute('autofocus', true);
        
        //create the spans and buttons 
        const boldButton = document.createElement('span');
        boldButton.id = 'bold'
        boldButton.setAttribute('class', 'toolbox-button');

        const italicButton = document.createElement('span');
        italicButton.id = 'italic'
        italicButton.setAttribute('class', 'toolbox-button');

        const underlinedButton = document.createElement('span');
        underlinedButton.id = 'underlined'
        underlinedButton.setAttribute('class', 'toolbox-button');

        const unorderedButton = document.createElement('span');
        unorderedButton.id = 'unorderedList'
        unorderedButton.setAttribute('class', 'toolbox-button');

        const orderedButton = document.createElement('span');
        orderedButton.id = 'orderedList'
        orderedButton.setAttribute('class', 'toolbox-button');

        // add all functions to the format buttons

        boldButton.addEventListener('click', () => {
            this.changeClass(boldButton)
            this.formatBold()
        })

        italicButton.addEventListener('click', () => {
            this.changeClass(italicButton)
        })

        underlinedButton.addEventListener('click', () => {
            this.changeClass(underlinedButton)
        })

        unorderedButton.addEventListener('click', () => {
            this.changeClass(unorderedButton)
            this.removeActiveState(orderedButton)

        })

        orderedButton.addEventListener('click', () => {
            this.changeClass(orderedButton)
            this.removeActiveState(unorderedButton)
        })

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

    changeClass(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }else{
            button.classList.add('active')
        }
    }
    
    removeActiveState(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }
    }

    formatBold(){}
}
customElements.define('text-editor', TextEditor)