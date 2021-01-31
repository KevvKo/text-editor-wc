import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';
import image4 from './assets/img/format_list_numbered-black-24dp.svg';
import image5 from './assets/img/format_list_bulleted-black-24dp.svg';

import {style} from './assets/js/style'

/**
@todo implementation for dynamically formatting across multiple differenct nodes
@todo implementation format functions ordered-/unordered list

 */
class TextEditor extends HTMLElement {

    constructor(){
        super()

        this.surroundingFormatNodes = {
            'B': false,             // bold
            'I': false,             // italic
            'U': false              // underlined
        }

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

        const row = document.createElement('p')
        row.innerHTML = '\u200B';

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

        this.formatButtons = {
            'B': boldButton,
            'I': italicButton,
            'U': underlinedButton
        }
    }

    /**
     * 
     * @param {Event} e 
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
     * @param {HTMLButtonElement} button: a button element from the toolbox 
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
     * @param {HTMLButtonElement} button 
     */

    addActiveState(button){
        if(!button.classList.contains('active')){
            button.classList.add('active')
        }
    }

    /**
     * 
     * @param {HTMLButtonElement} button 
     */

    removeActiveState(button){
        if(button.classList.contains('active')){
            button.classList.remove('active')
        }
    }

    /**
     * 
     * @param {Node} node 
     */
    removeZeroWidthCharacter(node){

        if(node.innerHTML.length > 1){
            
           if(node.innerHTML.search('\u200B') >= 0 ){
               node.innerHTML = node.innerHTML.replace('\u200B', '')
           }

        } else {
            node.innerHTML = '\u200B'
        }
    }

    /**
     * 
     * @param {String} elementName 
     * @param {String} tagName 
     * @param {HTMLButtonElement} button
     */

    format(elementName, tagName, button){

        let selection = window.getSelection()
        let element = document.createElement(elementName)
        element.innerHTML = '\u200B'

        if(button.classList.contains("active")){

            this.removeFormatting(selection, tagName)    
            this.toggleActiveState(button)
            this.surroundingFormatNodes[tagName] = false

            return
        }

        this.toggleActiveState(button)
        this.surroundingFormatNodes[tagName] = true

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

    /**
     * 
     * @param {HTMLButtonElement} boldButton 
     */

    formatBold(boldButton){

        this.format('b', 'B', boldButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} italicButton: button to format text italic
     */

    formatItalic(italicButton){

        this.format('i', 'I', italicButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} underlinedButton: button to format text as underlined
     */

    formatUnderlined(underlinedButton){

        this.format('u', 'U', underlinedButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} unorderedButton: button - button to insert a unordered List
     * @param {HTMLButtonElement} orderedButton: button - button to insert a ordered list
     */

    formatUnorderedList(unorderedButton, orderedButton){
        this.toggleActiveState(unorderedButton)
        this.removeActiveState(orderedButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} orderedButton - button to insert a ordered list
     * @param {HTMLButtonElement} unorderedButton - button to insert a unordered List
     */

    formatOrderedList(orderedButton, unorderedButton){
        this.toggleActiveState(orderedButton)
        this.removeActiveState(unorderedButton)
    }

    /**
     * 
     * @param {Number} start: startindex of a range for the caret
     * @param {Number} end: endindex of a range for the caret
     */

    getCaret(){

        let selection = window.getSelection()

        if(selection.anchorOffset === selection.focusOffset) return selection.anchorOffset
 
        return selection.focusOffset
    }

    /**
     * 
     * @param {Number} caretIndex
     * @param {Node} element
     */
    setCaret(caretIndex, element){

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
     * @param {Node} node
     * @param {Selection} selection 
     */
    setCaretAfterNode(node, selection){
     
        const range = document.createRange()

        range.setStartAfter(node)
        range.setEndAfter(node)

        selection.removeAllRanges()
        selection.addRange(range)


    }

    /**
     * 
     * @param {Node} node 
     * @param {Selection} selection 
     */
    setCaretBefore(node, selection){

        const range = selection.getRangeAt(0)

        range.setStartBefore(node)
        range.setEndBefore(node)

        selection.removeAllRanges()
        selection.addRange(range)
    }

    /**
     * 
     * @param {Node} element  - a formatting node element ( <b>, <i>, <u>,---)
     * @param {Selection} selection 
     * @param {Range} range 
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
     * @param {Selection} selection 
     * @param {String} tagName 
     */
    surroundMultipleNodes(selection, tagName){

        const range = selection.getRangeAt(0)
        const content = range.cloneContents()
        const startContainer = range.startContainer
        const endContainer = range.endContainer
        const rootNode = this.shadowRoot.querySelector('#content')

        if( startContainer.tagName === 'P' || startContainer.parentNode.tagName === 'P' ){

            let node = document.createElement(tagName)
            node.appendChild(content)

            const parentNode = this.getEqualParentNode(startContainer, endContainer)

            if(parentNode.isEqualNode(rootNode) || startContainer.isEqualNode(endContainer)){

                range.surroundContents(node)

            } else if(parentNode.isEqualNode(startContainer.parentNode)){

                if(startContainer.tagName === 'P'){
                    
                    const temporaryNode = node
                    node = startContainer.cloneNode()
                    node.appendChild(temporaryNode) 
                }

                parentNode.insertBefore(node, startContainer)

                this.removeNodesInRange(range, startContainer)

            } else{

                parentNode.insertBefore(node, startContainer.parentNode)
                this.removeNodesInRange(range, startContainer.parentNode)
            }

            const firstChild = node.firstChild
            const lastChild = node.lastChild

            this.setRange(selection, firstChild, lastChild)
        }
    }

    /**
     * 
     * @param {Selection} selection 
     * @param {String} nodeName 
     */

     /**
      * 
      * @@todo remove second condition if solution for removing non zero char is implemented 
      * or find a better approach as condition
      */
    removeFormatting(selection, nodeName){

        let caretIndex = this.getCaret()

        if(selection.isCollapsed){

            if(selection.anchorOffset === selection.focusOffset && selection.anchorOffset === 0 ){
                
                this.removeEmptyNode(nodeName, selection)
                return
            }
                                                                         // removable                       
            if(selection.anchorOffset === selection.anchorNode.length || selection.anchorOffset === selection.anchorNode.length -1){

                const node = selection.anchorNode.parentNode
                this.setCaretAfterNode(node, selection)
                return
            }
                        
            this.insertTextNode(selection, nodeName, caretIndex)
            return
        }

        this.removeSurroundingNode( selection, nodeName )
        
    }

    /**
     * 
     * @param {Range} range 
     * @param {Node} startNode
     */
    removeNodesInRange(range, startNode){

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
     * @param {String} nodeName 
     * @param {Selection} selection 
     */

    removeEmptyNode(nodeName, selection){

        let nodeIsEmpty;

        // depend on selection, which case will be confirmed for an empty node
        // length of 1, cause the zero-width character is included -> just a temporary solution, until a better workflow is implemented

        nodeIsEmpty = selection.anchorNode.parentNode.textContent.length === 1; 

        if( selection.anchorNode.parentNode.nodeName === nodeName && nodeIsEmpty) {
            
            const node = selection.anchorNode.parentNode

            this.setCaretBefore(node, selection)
            node.remove()

            return 
        }

        nodeIsEmpty = selection.anchorNode.textContent === ''
        if( selection.focusNode.nodeName === nodeName ) {

            const node = selection.anchorNode

            this.setCaretBefore(node, selection)
            node.remove()

            return
        }
    }
    
    /**
     * 
     * @param {Selection} selection
     * @param {String} nodeName 
     */

    removeSurroundingNode( selection, nodeName ){

        const parentNode = selection.anchorNode.parentNode
        let content = selection.getRangeAt(0).cloneContents()

        // case if the surrounding node is the parentnode
        if(parentNode.nodeName === nodeName){  

            const range = document.createRange()
            let firstChild, lastChild

            parentNode.childNodes.forEach( childNode => {
                
                if(childNode.isEqualNode( parentNode.firstChild)){
                    firstChild = parentNode.firstChild
                }

                if(childNode.isEqualNode( parentNode.lastChild)){
                    lastChild = parentNode.lastChild
                }

                parentNode.parentNode.insertBefore(childNode, parentNode)
            })

            parentNode.remove()
            this.setRange(selection, firstChild, lastChild)

            return
        }


        const anchorNode = selection.anchorNode


        if(anchorNode.nodeName === nodeName){
            
            const parentOfAnchorNode = anchorNode.parentNode
            let firstChild, lastChild

            anchorNode.childNodes.forEach(childNode => {
                                
                if(childNode.isEqualNode( anchorNode.firstChild)){
                    firstChild = anchorNode.firstChild
                }

                if(childNode.isEqualNode( anchorNode.lastChild)){
                    lastChild = anchorNode.lastChild
                }

                parentOfAnchorNode.insertBefore(childNode, anchorNode)
            })

            this.setRange(selection, firstChild, lastChild)
            anchorNode.remove()
            
            return
        }

        // to find the correct node for removiing 
        anchorNode.childNodes.forEach( (node) => {
            
            if(node.nodeName === nodeName){

                const childNodes = Array.from( content.firstChild.childNodes )
                
                if(node.isEqualNode( content.firstChild )){ // for the case, the document fragment contains the to removable node 

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
     * @param {Node} node1 
     * @param {Node} node2 
     */
    getEqualParentNode(node1, node2){

        let parentNode = node1.parentNode
    
        while( !parentNode.isEqualNode(node2.parentNode) ){

            if(parentNode.tagName === 'P'){
                return parentNode
            }

            parentNode = parentNode.parentNode
        }
 
        return parentNode
    }

    /**
     * 
     * @param {Selection} selection 
     * @param {String} nodeName 
     * @param {Number} caretIndex 
     */

    insertTextNode(selection, nodeName, caretIndex){

        const parentNode = selection.anchorNode.parentNode.parentNode
        const editableNode = selection.anchorNode.parentNode
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

        this.setCaretAfterNode(frontNode, selection)
        editableNode.remove()
    }

    /**
     * 
     * @param {Selection} selection 
     * @param {Node} startNode 
     * @param {Node} EndNode 
     */

    setRange(selection, startNode, EndNode){

        const range = document.createRange()

        range.setStartBefore(startNode)
        range.setEndAfter(EndNode)

        selection.removeAllRanges()
        selection.addRange(range)
    }

    observeFormatting(){
        
        const selection = window.getSelection()
        const formatTagNames = [ 'B', 'I', 'U']
        let node = selection.anchorNode

        if(node.tagName === 'P' || node.parentNode.tagName === 'P'){

            for( const [key, value] of Object.entries( this.surroundingFormatNodes)){
                this.surroundingFormatNodes[key] = false
            }

            return
        }
        
        while( node.tagName !== 'P'){

            node = node.parentNode 
            let tagName = node.tagName

            if(node.tagName === 'P'){
                return
            }

            if(formatTagNames.includes( tagName )){
                this.surroundingFormatNodes[ tagName ] = true
            }else{
                this.surroundingFormatNodes[ tagName ] = false
            }
        }
    }

    setStatesForFormatButtons(){

        for (const [key, value] of Object.entries(this.surroundingFormatNodes)){

            const button = this.formatButtons[key]

            if(value){
                this.addActiveState(button)
            }else{
                this.removeActiveState(button)
            }
        }
    }

    connectedCallback() {
        
        this.shadowRoot.getElementById('content').addEventListener('click', () => {
            this.observeFormatting()
            this.setStatesForFormatButtons()
        })

        this.shadowRoot.getElementById('content').addEventListener('keyup', () => {
            this.observeFormatting()
            this.setStatesForFormatButtons()
        })
    }
}

customElements.define('text-editor', TextEditor)