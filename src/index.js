import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';
import image4 from './assets/img/format_list_numbered-black-24dp.svg';
import image5 from './assets/img/format_list_bulleted-black-24dp.svg';

import {style} from './assets/js/style'
import { partialRight } from 'lodash';

/**
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

        const row = document.createElement('p')
        row.innerHTML = '&#8203';

        textbox.addEventListener('keydown', (e) => {
            this.preventDelete(e)
        })
        
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
        textbox.appendChild(row)
        
    }

    /**
     * 
     * @param {object} e 
     */
    preventDelete(e){
        
        const selection = window.getSelection()

        if(e.keyCode === 8 || e.keyCode === 48){

                const anchorNode = selection.anchorNode
                let rowNode

                if(anchorNode.nodeName === 'P'){

                    rowNode = anchorNode

                 }
                 else if(anchorNode.parentNode.nodeName === 'P'){

                    rowNode = anchorNode.parentNode
                }
                
                if(rowNode){
                    
                    if(rowNode.childNodes.length === 1){

                        if(rowNode.childNodes[0].textContent.length < 1){

                                if(rowNode.previousSibling === null){ // to avoid to remove the last rownode in the textbox
                                    e.preventDefault()
                                }
                        }
                    }
                }           
        }
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
        element.innerHTML = '&#8203;'

        if(button.classList.contains("active")){

            this.removeFormatting(selection, tagName)    
            this.toggleActiveState(button)

            return
        }

        this.toggleActiveState(button)

        if(selection.type === 'Caret' && selection.isCollapsed){

            const box = this.shadowRoot.getElementById('content')

            if(!box.contains(selection.anchorNode)){ // to insert a formatting node if the texteditor is not focused
                
                const paragraph = this.shadowRoot.querySelector('#content p')

                paragraph.appendChild(element)
                this.setCaret(0, element)                

            }else{

                this.insertElement(element, selection)
            }

            element.focus()

            return
        }

        // surround the selected content
        if(selection.type === 'Range' && selection.anchorOffset !== selection.focusOffset){
           
            this.surroundMultipleNodes(selection, tagName)
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
     * @param {integer} caretIndex
     * @param (object) element
     */
    setCaret(caretIndex, element){

        let contentbox = this.shadowRoot.getElementById('content');
        contentbox.focus();

        let range = new Range()
        let selection = window.getSelection() 
        
        if(element){
     
            range.setStart( element, caretIndex );
            range.setEnd( element, caretIndex);
        } else{
            range.setStart( selection.focusNode, caretIndex );
            range.setEnd( selection.focusNode, caretIndex);
        }

        selection.removeAllRanges()
        selection.addRange(range)
        
    }

    /**
     * 
     * @param {Object} node
     * @param (Object) selection 
     */
    setCaretAfterNode(node, selection){
        
        const range = selection.getRangeAt(0)

        range.setStartAfter(node)
        range.setEndAfter(node)

        selection.removeAllRanges()
        selection.addRange(range)

    }

    /**
     * 
     * @param {node} element  - a formatting node element ( <b>, <i>, <u>,---)
     * @param {object} selection 
     * @param {object} range 
     */

    insertElement( element, selection ){
        
        const range = selection.getRangeAt(0)

        range.setStart(selection.anchorNode, selection.anchorOffset)
        range.setEnd(selection.focusNode, selection.focusOffset)
        range.insertNode(element)

        range.setStart(element, 0)
        range.setEnd(element, 0)
    }

    /**
     * 
     * @param {Object} selection 
     * @param {Object} tagName 
     */
    surroundMultipleNodes(selection, tagName){

        const range = selection.getRangeAt(0)
        const content = range.cloneContents()
        const startContainer = range.startContainer
        const endContainer = range.endContainer

        if(range.startOffset === 0){

            let node = document.createElement(tagName)
            node.appendChild(content)
   
            const parentNode = this.getEqualParentNode(startContainer, endContainer)

            if(parentNode.isEqualNode(startContainer.parentNode)){
                parentNode.insertBefore(node, startContainer)
                this.removeNodesInRange(range, startContainer)

            } else{
                parentNode.insertBefore(node, startContainer.parentNode)
                this.removeNodesInRange(range, startContainer.parentNode)
            }

            const newRange = document.createRange()

            newRange.setStartBefore(node)
            newRange.setEndAfter(node)

            selection.removeAllRanges()
            selection.addRange(newRange)
        }
    }


    /**
     * 
     * @param {Selection} selection 
     * @param {String} nodeName 
     */
    removeFormatting(selection, nodeName){

        let caretIndex = this.getCaret()

        if(selection.isCollapsed){

            if(selection.anchorOffset === selection.focusOffset && selection.anchorOffset === 0 ){
                
                this.removeEmptyNode(nodeName, selection, caretIndex)
                return
            }

            if(selection.anchorOffset === selection.anchorNode.length-1){

                const node = selection.anchorNode.parentNode
                this.setCaretAfterNode(node, selection)
                return
            }
            
            const node = selection.anchorNode.parentNode
            
            this.insertTextNode(selection, nodeName, caretIndex)
            return
        }

        this.removeSurroundingNode( selection, nodeName )
        
    }

    /**
     * 
     * @param {Object} range 
     * @param (Object) startNode
     */
    removeNodesInRange(range, startNode){

        const startContainer = range.startContainer
        const endNode = range.endContainer
        const parentNode = this.getEqualParentNode(startNode, endNode)
        const childNodes = Array.prototype.slice.call(parentNode.childNodes)
        let i = Array.prototype.indexOf.call(childNodes, startNode)

        const removableNodes = childNodes.slice(i)

        removableNodes.forEach( node => {
            node.remove()
        })
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
        let content = selection.getRangeAt(0).cloneContents()

        // case if the surrounding node is a parentnode
        if(parentNode.nodeName === nodeName){       
        
            parentNode.parentNode.insertBefore(content, parentNode)
            parentNode.remove()
            
            return
        }

        const anchorNode = selection.anchorNode

        // to find the correct node for removiing 
        anchorNode.childNodes.forEach( (node) => {

            if(node.nodeName === nodeName){

                const childNodes = Array.from( content.firstChild.childNodes )
                
                if(node.isEqualNode( content.firstChild)){ // for the case, the document fragment contains the to removable node 

                    childNodes.forEach( childNode => {

                        anchorNode.insertBefore(childNode, node)
                    
                    })
                }
            
                node.remove()
            }
        })

    }

    getSurroundingNode(){

        const selection = window.getSelection()
        return selection.anchorNode.parentNode
    }

    /**
     * 
     * @param {Object} node1 
     * @param {Object} node2 
     */
    getEqualParentNode(node1, node2){

        const rootNode = this.shadowRoot.getElementById('content')
        let parentNode = node1.parentNode

        while( !parentNode.isEqualNode(node2.parentNode) ){

            if(parentNode.isEqualNode(rootNode)){
                return rootNode
            }

            parentNode = parentNode.parentNode
        }
 
        return parentNode
    }

    /**
     * 
     * @param {*} selection 
     * @param {*} nodeName 
     * @param {*} caretIndex 
     */

    insertTextNode(selection, nodeName, caretIndex){
        
        const parentNode = selection.anchorNode.parentNode.parentNode
        const editableNode = selection.anchorNode.parentNode
        const range = selection.getRangeAt(0)
        const content = selection.anchorNode.textContent
        const frontContent = content.substring(0, caretIndex)
        const backContent = content.substring(caretIndex, content.length)

        const frontNode = document.createElement(nodeName.toLowerCase())
        frontNode.innerText = frontContent

        const backNode = document.createElement(nodeName.toLowerCase())
        backNode.innerText = backContent

        if(!editableNode.previousSibling){

            parentNode.appendChild(frontNode)
            parentNode.appendChild(backNode)

        } else{

            const sibling = editableNode.previousSibling

            sibling.after(frontNode)
            frontNode.after(backNode)
        }

        range.setStartAfter(frontNode)
        range.setEndBefore(backNode)

        selection.removeAllRanges()
        selection.addRange(range)

        editableNode.remove()
    }

    connectedCallback() {
        
        this.shadowRoot.getElementById('content').addEventListener('click', () => {
        })

        this.shadowRoot.getElementById('content').addEventListener('keydown', () => {
        })
    }
}

customElements.define('text-editor', TextEditor)