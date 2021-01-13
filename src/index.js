import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';
import image4 from './assets/img/format_list_numbered-black-24dp.svg';
import image5 from './assets/img/format_list_bulleted-black-24dp.svg';

import {style} from './assets/js/style'

/**
 @todo after removing a surrounded node, selelection is sometimes wrong set
 @todo implementation for dynamically formatting across multiple differenct nodes
 @todo implementation format functions ordered-/unordered list

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

        const toolboxSection1 = document.createElement('div')
        toolboxSection1.className = 'toolbox-section' 

        const toolboxSection2 = document.createElement('div')
        toolboxSection2.className = 'toolbox-section' 

        //create the spans and buttons 
        const boldButton = document.createElement('div');
        boldButton.id = 'bold'
        boldButton.setAttribute('class', 'toolbox-button');

        const italicButton = document.createElement('div');
        italicButton.id = 'italic'
        italicButton.setAttribute('class', 'toolbox-button');

        const underlinedButton = document.createElement('div');
        underlinedButton.id = 'underlined'
        underlinedButton.setAttribute('class', 'toolbox-button');

        const unorderedButton = document.createElement('div');
        unorderedButton.id = 'unorderedList'
        unorderedButton.setAttribute('class', 'toolbox-button');

        const orderedButton = document.createElement('div');
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

        toolbox.appendChild(toolboxSection1)
        toolbox.appendChild(toolboxSection2)

        toolboxSection1.appendChild(boldButton);
        toolboxSection1.appendChild(italicButton);
        toolboxSection1.appendChild(underlinedButton);

        toolboxSection2.appendChild(unorderedButton);
        toolboxSection2.appendChild(orderedButton);

        boldButton.appendChild(imageBold);
        italicButton.appendChild(imageItalic);
        underlinedButton.appendChild(imageUnderlined);
        unorderedButton.appendChild(imageUnorderedList);
        orderedButton.appendChild(imageOrderedList);

        template.appendChild(textbox);
        this.setCurrentNode(textbox)
    }

    /**
     * 
     * @param {button} button: a button element from the toolbox 
     */

    toggleActiveState(button){
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

    /**
     * 
     * @param {String} elementName 
     * @param {String} tagName 
     * @param {Object} button
     */

    format(elementName, tagName, button){

        let selection = window.getSelection()
        let element = document.createElement(elementName)
        let range;
        //remove formatting
        if(button.classList.contains("active")){

            this.removeFormatting(selection, tagName)    
            this.toggleActiveState(button)
            this.setCurrentNode(element)

            return
        }

        this.toggleActiveState(button)

        if(selection.type === 'Caret' && selection.isCollapsed){

            const box = this.shadowRoot.getElementById('content')

            if(!box.contains(selection.anchorNode)){

                const range = document.createRange()
                
                range.setStart(box, 0)
                range.setEnd(box, 0)

                selection.removeAllRanges()
                selection.addRange(range)

                this.insertElement(element, selection)

            }else{
                this.insertElement(element, selection)
            }

            this.setCurrentNode(element)
            element.focus()

            return
        }

        // surround the selected content
        if(selection.type === 'Range' && selection.anchorOffset !== selection.focusOffset){

            range = selection.getRangeAt(0)
            range.surroundContents(element)
            this.setCurrentNode(element)
        }
    }

    /*
        boldButton: button - button to format text bold
    */

    formatBold(boldButton){
        this.format('b', 'B', boldButton)
    }

    /**
     * 
     * @param {button} italicButton: button to format text italic
     */

    formatItalic(italicButton){
        this.format('i', 'I', italicButton)
    }

    /**
     * 
     * @param {button} underlinedButton: button to format text as underlined
     */

    formatUnderlined(underlinedButton){
        this.format('u', 'U', underlinedButton)
    }

    /**
     * 
     * @param {button} unorderedButton: button - button to insert a unordered List
     * @param {button} orderedButton: button - button to insert a ordered list
     */

    formatUnorderedList(unorderedButton, orderedButton){
        this.toggleActiveState(unorderedButton)
        this.removeActiveState(orderedButton)
    }

    /**
     * 
     * @param {button} orderedButton - button to insert a ordered list
     * @param {button} unorderedButton - button to insert a unordered List
     */

    formatOrderedList(orderedButton, unorderedButton){
        this.toggleActiveState(orderedButton)
        this.removeActiveState(unorderedButton)
    }

    /**
     * 
     * @param {integer} start: startindex of a range for the caret
     * @param {integer} end: endindex of a range for the caret
     */

    getCaret(){

        let selection = window.getSelection()

        if(selection.anchorOffset === selection.focusOffset) return selection.anchorOffset
 
        return selection.focusOffset
    }

    /**
     * 
     * @param {integer} caretIndex: index of a range for the caret
     */
    setCaret(caretIndex){

        let contentbox = this.shadowRoot.getElementById('content');
        contentbox.focus();

        let range = new Range()
        let selection = window.getSelection() 
        range.setStart( selection.focusNode, caretIndex );
        range.setEnd( selection.focusNode, caretIndex);
    }

    /**
     * 
     * @param {node} element  - a formatting node element ( <b>, <i>, <u>,---)
     * @param {object} selection 
     * @param {object} range 
     */

    insertElement( element, selection ){
        
        const range = selection.getRangeAt(0)

        element.innerHTML = '&#8203;';

        range.setStart(selection.anchorNode, selection.anchorOffset)
        range.setEnd(selection.focusNode, selection.focusOffset)
        range.insertNode(element)

        range.setStart(element, 0)
        range.setEnd(element, 0)
        //element.focus()
    }

    /**
     * 
     * @param {Selection} selection 
     * @param {String} nodeName 
     */
    removeFormatting(selection, nodeName){

        let caretIndex = this.getCaret()
        if(selection.isCollapsed ){

            this.removeEmptyNode(nodeName, selection, caretIndex)
            return
        }

        this.removeSurroundingNode( selection, nodeName )
        
    }

    /**
     * 
     * @param {string} nodeName 
     * @param {Object} selection 
     * @param {integer} caretIndex 
     */

    removeEmptyNode(nodeName, selection, caretIndex){

        let nodeIsEmpty;

        // depend on selection, which case will be confirmed for an empty node
        // length of 1, cause the zero-width character is included -> just a temporary solution, until a better workflow is implemented

        nodeIsEmpty = selection.anchorNode.parentNode.textContent.length === 1; 

        if( selection.anchorNode.parentNode.nodeName === nodeName && nodeIsEmpty) {
            
            selection.anchorNode.parentNode.remove()
            this.setCaret(caretIndex)

            return 
        }

        nodeIsEmpty = selection.anchorNode.textContent === ''
        if( selection.focusNode.nodeName === nodeName ) {
            
            selection.anchorNode.remove()
            this.setCaret(caretIndex)
            
            return
        }
    }
    
    /**
     * 
     * @param {object} selection 
     */

    removeSurroundingNode( selection, nodeName ){

        const selectionContent = selection.toString()
        const parentNode = selection.anchorNode.parentNode
        let range = document.createRange()
        let element = document.createTextNode(selectionContent)

        element.innerHTML = selectionContent

        // case if the surrounding node is a parentnode
        if(parentNode.nodeName === nodeName){       

            parentNode.parentNode.insertBefore(element, parentNode)
            parentNode.remove()

            selection.deleteFromDocument()
            selection.removeAllRanges()

            range.setStart(element, 0)
            range.setEnd(element, selectionContent.length)

            return
        }

        const anchorNode = selection.anchorNode

        anchorNode.childNodes.forEach( (node) => {
            
            if(node.nodeName === nodeName){
                console.log(anchorNode)
                anchorNode.insertBefore(element, node)
                node.remove()
                                
                range.setStart(element, 0)
                range.setEnd(element, selectionContent.length)
            
                return
            }
        })

    }

    getSurroundingNode(){

        const selection = window.getSelection()
        return selection.anchorNode.parentNode
    }

    detectFormatting(){

        // const node = this.getSurroundingNode()
        // const formattingNodes = ['B', 'I', 'U']

        // if( formattingNodes.includes(this.currentNode.nodeName) && this.currentNode.nodeName !== node.nodeName){
            
        //     if(this.currentNode.nodeName === 'B'){
                
        //         const boldButton = this.shadowRoot.getElementById('bold')
        //         this.removeActiveState(boldButton)
        //         this.setCurrentNode(node)
        //         return
        //     }
        // }

        // if( formattingNodes.includes(node.nodeName) && this.currentNode.nodeName !== node.nodeName ){
            
        //     if(node.nodeName === 'B'){
                
        //         const boldButton = this.shadowRoot.getElementById('bold')
        //         this.toggleActiveState(boldButton)
        //         this.setCurrentNode(node)
        //         return 
        //     }
        // }
        
        // if(formattingNodes.includes(node.nodeName)){
        //     this.setCurrentNode(node)
        // }
    }

    /**
     * 
     * @param {object} node 
     */
    setCurrentNode(node){
        this.currentNode = node
    }

    connectedCallback() {
        
        this.shadowRoot.getElementById('content').addEventListener('click', () => {
            this.detectFormatting()
        })

        this.shadowRoot.getElementById('content').addEventListener('keydown', () => {
            this.detectFormatting()
        })
    }
}

customElements.define('text-editor', TextEditor)