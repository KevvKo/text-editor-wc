import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';
import image4 from './assets/img/format_list_numbered-black-24dp.svg';
import image5 from './assets/img/format_list_bulleted-black-24dp.svg';

import './assets/css/style.css';

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
            this.formatItalic()
        })

        underlinedButton.addEventListener('click', () => {
            this.changeClass(underlinedButton)
            this.formatUnderlined()
        })

        unorderedButton.addEventListener('click', () => {
            this.changeClass(unorderedButton)
            this.removeActiveState(orderedButton)
            this.formatUnorderedList()

        })

        orderedButton.addEventListener('click', () => {
            this.changeClass(orderedButton)
            this.removeActiveState(unorderedButton)
            this.formatOrderedList()
        })

        //create the images
        const imageBold = document.createElement('img')
        imageBold.src = image1
        
        const imageItalic = document.createElement('img');
        imageItalic.src = image2

        const imageUnderlined = document.createElement('img');
        imageUnderlined.src = image3

        const imageUnorderedList = document.createElement('img');
        imageUnorderedList.src = image4

        const imageOrderedList = document.createElement('img');
        imageOrderedList.src = image5   

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

    /* PARAMS:
    	button: button - a button element from the toolbox
     */
    changeClass(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }else{
            button.classList.add('active')
        }
    }
    
    /* PARAMS:
    	button: button - a button element from the toolbox
     */
    removeActiveState(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }
    }

    formatBold(){
        this.setCaret()
    }

    formatItalic(){}

    formatUnderlined(){}

    formatUnorderedList(){}

    formatOrderedList(){}

    /* PARAMS: 
        start: integer - startindex of a range for the caret
        end: integer . endindex of a range for the caret
    */
    getCaret(start, end){

        if(start === end) return start
        
        return end
    }

    setCaret(){
        const contentbox = this.shadowRoot.getElementById('content');
        contentbox.focus();

        const selection = window.getSelection()
        const caretIndex = this.getCaret(
            selection.anchorOffset, 
            selection.focusOffset
        );

        const range = new Range()
        range.setStart( selection.focusNode, caretIndex );
        range.setEnd( selection.focusNode, caretIndex );
    }

}
g
customElements.define('text-editor', TextEditor)