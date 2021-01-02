import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';
import image4 from './assets/img/format_list_numbered-black-24dp.svg';
import image5 from './assets/img/format_list_bulleted-black-24dp.svg';

import {style} from './assets/js/style'

/**
 @todo function to remove formatting
 @todo implementation for dynamically formatting across multiple differenct nodes
 @todo implementation format functions ordered-/unordered list
 @todo css-adjustments for toolbox
 */
class TextEditor extends HTMLElement {

    constructor(){
        super()

        // inline html template
        const template = document.createElement('div');
        template.setAttribute('id', 'text-editor');
        template.innerHTML = style;

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
            this.formatBold(boldButton)
        })

        italicButton.addEventListener('click', () => {
            this.formatItalic(italicButton)
        })

        underlinedButton.addEventListener('click', () => {
            this.formatUnderlined(underlinedButton)
        })

        unorderedButton.addEventListener('click', () => {
            this.formatUnorderedList(unorderedButton, orderedButton)

        })

        orderedButton.addEventListener('click', () => {
            this.formatOrderedList(orderedButton, unorderedButton)
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

    /**
     * 
     * @param {button} button: a button element from the toolbox 
     */

    changeClass(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }else{
            button.classList.add('active')
        }
    }
    
    /**
     * 
     * @param {button} button 
     */

    removeActiveState(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }
    }

    /*
        boldButton: button - button to format text bold
    */

    formatBold(boldButton){

        let selection = window.getSelection()
        let element = document.createElement('b')
        let range;

        this.changeClass(boldButton)

        // insert an emtpy node
        if(selection.type === 'Caret' && selection.isCollapsed){

            this.insertElement(element, selection, range)
            return
        
        }

        // surround the selected content
        if(selection.type === 'Range' && selection.anchorOffset !== selection.focusOffset){

            range = selection.getRangeAt(0)
            range.surroundContents(element)
        }
    }

    /**
     * 
     * @param {button} italicButton: button to format text italic
     */

    formatItalic(italicButton){

        let selection = window.getSelection()
        let element = document.createElement('i')
        let range;

        this.changeClass(italicButton)

        // insert an emtpy node
        if(selection.type === 'Caret' && selection.isCollapsed){

            this.insertElement(element, selection, range)
            return
        }

        // surround the selected content
        if(selection.type === 'Range' && selection.anchorOffset !== selection.focusOffset){

            range = selection.getRangeAt(0)
            range.surroundContents(element)
        }
    }

    /**
     * 
     * @param {button} underlinedButton: button to format text as underlined
     */

    formatUnderlined(underlinedButton){

        let selection = window.getSelection()
        let element = document.createElement('u')
        let range;

        this.changeClass(underlinedButton)

        // insert an emtpy node
        if(selection.type === 'Caret' && selection.isCollapsed){

            this.insertElement(element, selection, range)
            return
        }

        // surround the selected content
        if(selection.type === 'Range' && selection.anchorOffset !== selection.focusOffset){

            range = selection.getRangeAt(0)
            range.surroundContents(element)
        }
    }

    /**
     * 
     * @param {button} unorderedButton: button - button to insert a unordered List
     * @param {button} orderedButton: button - button to insert a ordered list
     */

    formatUnorderedList(unorderedButton, orderedButton){
        this.changeClass(unorderedButton)
        this.removeActiveState(orderedButton)
    }

    /**
     * 
     * @param {button} orderedButton - button to insert a ordered list
     * @param {button} unorderedButton - button to insert a unordered List
     */

    formatOrderedList(orderedButton, unorderedButton){
        this.changeClass(orderedButton)
        this.removeActiveState(unorderedButton)
    }

    /**
     * 
     * @param {integer} start: startindex of a range for the caret
     * @param {integer} end: endindex of a range for the caret
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

    /**
     * 
     * @param {node} element  - a formatting node element ( <b>, <i>, <u>,---)
     * @param {object} selection 
     * @param {object} range 
     */

    insertElement(element, selection, range){

        element.innerHTML = '&#8203;';
        range = selection.getRangeAt(0)
        range.setStart(selection.anchorNode, selection.anchorOffset)
        range.setEnd(selection.focusNode, selection.focusOffset)
        range.insertNode(element)

        range.setStart(element, 0)
        range.setEnd(element, 0)
    }

    removeFormatting(){

    }

    connectedCallback() {
        this.shadowRoot.getElementById('content').focus();
    }
}

customElements.define('text-editor', TextEditor)