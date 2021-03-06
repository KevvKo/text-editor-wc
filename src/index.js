import { first, range } from 'lodash';
import image1 from './assets/img/format_bold-black-24dp.svg';
import image2 from './assets/img/format_italic-black-24dp.svg';
import image3 from './assets/img/format_underlined-black-24dp.svg';

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

        const row = document.createElement('p')
        row.innerHTML = '\u200B';

        const lineBreak = document.createElement('br')
        row.appendChild(lineBreak)
        textbox.addEventListener('keydown', (e) => {
            this.preventDelete(e)
        })
        
        textbox.addEventListener('input', () => {
            this.removeZeroWidthCharacter()
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

        //create the images
        const imageBold = document.createElement('img')
        imageBold.src = image1
        
        const imageItalic = document.createElement('img');
        imageItalic.src = image2

        const imageUnderlined = document.createElement('img');
        imageUnderlined.src = image3

        const shadow = this.attachShadow({mode: 'open'}); 
        shadow.appendChild(template);

        template.appendChild(toolbox);

        toolbox.appendChild(toolboxSection1)
        toolbox.appendChild(toolboxSection2)

        toolboxSection1.appendChild(boldButton);
        toolboxSection1.appendChild(italicButton);
        toolboxSection1.appendChild(underlinedButton);

        boldButton.appendChild(imageBold);
        italicButton.appendChild(imageItalic);
        underlinedButton.appendChild(imageUnderlined);

        template.appendChild(textbox);
        textbox.appendChild(row)

        this.formatButtons = {
            'B': boldButton,
            'I': italicButton,
            'U': underlinedButton
        }

        this.editor = textbox
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

            } else if(anchorNode.parentNode.nodeName === 'P'){
                
                rowNode = anchorNode.parentNode
            }
            
            if(rowNode){
                    
                if(rowNode.childNodes[0].textContent.length < 1){

                    if(rowNode.previousSibling === null){ // to avoid to remove the last rownode in the textbox
                        e.preventDefault()
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

    removeZeroWidthCharacter(){

        const selection = window.getSelection()
        const node = selection.anchorNode
        let index = selection.anchorOffset

        if(node.nodeType !== 3){

            if(node.innerHTML.length >= 1 && node.innerHTML.search('\u200B') >= 0 ){

               node.innerHTML = node.innerHTML.replace('\u200B', '')

               this.setCaret(index, node)
            }

        } else{
          
            if(node.parentNode.innerHTML.length > 1 && node.parentNode.innerHTML.search('\u200B') >= 0 ){
                node.parentNode.innerHTML = node.parentNode.innerHTML.replace('\u200B', '')

                // correct the index if the caret is set after the zer width character.
                // can be caused by clicking in the first row of the editor
                if(index > 1){  
                    index -= 1
                }

                this.setCaret(index, node.parentNode)
            } 
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

        if(selection.isCollapsed){

            const box = this.shadowRoot.getElementById('content')
            const paragraph = this.shadowRoot.querySelector('#content p')

            if(!box.contains(selection.anchorNode)){ // to insert a formatting node if the texteditor is not focused
                
                paragraph.innerHTML = paragraph.innerHTML.replace('\u200B', '')
                paragraph.insertAdjacentElement('afterbegin', element)

                this.setCaret(0, element)

            }else{
                
                const caretIndex = this.getCaret()
                const focusNodeLength = selection.focusNode.length
                const caretIsInTheMiddle = caretIndex > 0 && caretIndex < focusNodeLength

                if(caretIsInTheMiddle){
                    this.surroundSelection(selection, tagName)
                    return
                }

                this.insertElement(element, selection)
            }

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
     * @param {HTMLButtonElement} italicButton
     */

    formatItalic(italicButton){

        this.format('i', 'I', italicButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} underlinedButton
     */

    formatUnderlined(underlinedButton){

        this.format('u', 'U', underlinedButton)
    }

    /**
     * 
     * @param {HTMLButtonElement} unorderedButton
     * @param {HTMLButtonElement} orderedButton
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
     * @param {Selection} selection 
     * @param {Range} range 
     */

    insertElement( element, selection ){
        
        const range = selection.getRangeAt(0)
        const node = selection.anchorNode

        if(node.nodeType !== 3){

            if( node.innerHTML.search('\u200B') >= 0){
                node.innerHTML = node.innerHTML.replace('\u200B', '')
            }
        }

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

    surroundSelection(selection, tagName){

        const range = selection.getRangeAt(0) 
        const anchorNode = selection.anchorNode
        const node = document.createElement(tagName.toLowerCase())
        const caretIndex = this.getCaret()

        range.setStart(anchorNode, 0)
        range.setEnd(anchorNode, anchorNode.length)
        
        range.surroundContents(node)
        this.setCaret(caretIndex, node.firstChild)
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

        // if( startContainer.tagName === 'P' || startContainer.parentNode.tagName === 'P' ){

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
        // }
    }  

    /**
     * 
     * @param {Selection} selection 
     * @param {String} nodeName 
     */

    removeFormatting(selection, nodeName){

        let caretIndex = this.getCaret()
        const anchorNode = selection.anchorNode
        const focusNode = selection.focusNode
        const anchorOffset = selection.anchorOffset
        const focusOffset = selection.focusOffset

        if(selection.isCollapsed){

            const nodeIsEmpty = 
                anchorNode.textContent.search('\u200B') > -1 &&
                anchorNode.textContent.length === 1 ||
                anchorNode.textContent.length === 0

            const caretIsAtBegin = anchorOffset === 0
            const caretIsAtEnd = anchorOffset === anchorNode.length

            if(nodeIsEmpty){
                
                this.removeEmptyNode(nodeName, selection)
                return

            } else if(caretIsAtBegin){

                let node = anchorNode.parentNode

                if(node.nodeName === nodeName){
                    
                    this.setCaretBefore(node, selection)
                    return

                }else{

                    const parentnode = this.getParentNode(node, nodeName)
                    this.insertAdjacentEmptyFormatNodes(parentnode, nodeName, 'before')
                    return
                }
            }

            else if(caretIsAtEnd){

                const paragraph = this.shadowRoot.querySelector('paragraph')
                const node = anchorNode
                let parentNode = node.parentNode
            
                if(node.nodeName === nodeName){
                    
                    this.insertAdjacentEmptyFormatNodes(node, nodeName, 'after')
                    this.observeFormatting()
                    this.setStatesForFormatButtons(nodeName)
                    return
                }
                
                if(parentNode.nodeName === nodeName){

                    this.insertAdjacentEmptyFormatNodes(parentNode, nodeName, 'after')
                    this.observeFormatting()
                    this.setStatesForFormatButtons(nodeName)
                    return
                }

                while( parentNode.nodeName != nodeName || parentNode.isEqualNode(paragraph)){
                    parentNode = parentNode.parentNode

                    if(parentNode.nodeName === nodeName){

                        this.insertAdjacentEmptyFormatNodes(parentNode, nodeName, 'after')
                        this.observeFormatting()
                        this.setStatesForFormatButtons(nodeName)
                        return
                    }
                }
            }

            this.removeSurroundingNode( selection, nodeName )
            return
        }

        const paragraph = this.shadowRoot.querySelector('p')

        // range cases for textnode
        const rangeContainsCompleteTextNode = 
            anchorNode.nodeType === 3
            && anchorOffset === 0 && focusOffset === focusNode.length
            || focusOffset === 0 && anchorOffset === anchorNode.length

        // range cases for a formatnode
        const rangeContainsCompleteFormatNode = 
            Object.keys( this.surroundingFormatNodes ).includes( anchorNode.nodeName )
            || Object.keys( this.surroundingFormatNodes ).includes( focusNode.nodeName )
            || anchorNode.isEqualNode( paragraph ) && focusNode.nodeType === 3
            || focusNode.isEqualNode( paragraph ) && anchorNode.nodeType === 3


        if( rangeContainsCompleteTextNode || rangeContainsCompleteFormatNode ){
            this.removeSurroundingNode( selection, nodeName )
        }
        
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
        // length of 1, cause the zero-width character is included 

        nodeIsEmpty = 
            selection.anchorNode.parentNode.textContent.length === 1 
            && 
            selection.anchorNode.parentNode.innerText.search('\u200B') >= 0; 

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
        const paragraph = this.shadowRoot.querySelector('p')
        const anchorNode = selection.anchorNode

        let content = selection.getRangeAt(0).cloneContents()
        let node = selection.anchorNode

        while( !node.isEqualNode(paragraph)){

            if(node.nodeName === nodeName){
                this.insertChildNodesBefore(selection, node)            
                return
            }   

            node = node.parentNode
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
     * @param {Selection} selection 
     * @param {Node} focusNode 
     */

    insertChildNodesBefore(selection, focusNode){

        const parentOfAnchorNode = focusNode.parentNode
        const isCollapsed = selection.isCollapsed
        const caretIndex = this.getCaret()
        const focusNodeLength = selection.focusNode.length
        let firstChild, lastChild
        const nodeArray = []

        focusNode.childNodes.forEach(childNode => {
                            
            if(childNode.isEqualNode( focusNode.firstChild)){
                firstChild = focusNode.firstChild
            }

            if(childNode.isEqualNode( focusNode.lastChild)){
                lastChild = focusNode.lastChild
            }

            nodeArray.push(childNode)
        })

        nodeArray.forEach( childNode => {
            parentOfAnchorNode.insertBefore(childNode, focusNode)    
        })

        if(isCollapsed){

            const caretIsAtBegin = caretIndex === 0 
            const caretIsInTheMiddle = caretIndex > 0 && caretIndex <= focusNodeLength

            if(caretIsAtBegin){

                this.setCaretBefore(firstChild, selection)

            } else if (caretIsInTheMiddle){

                if(firstChild.nodeType === 3) {
                    this.setCaret(caretIndex, firstChild)
                }

                let child = firstChild.firstChild

                while(child){

                    if(child.nodeType === 3){

                        this.setCaret(caretIndex, child)
                    }

                    child = child.firstChild
                }


            } else{

                this.setCaretAfterNode(lastChild, selection)
            }

        }else{

            this.setRange(selection, firstChild, lastChild)
        }

        focusNode.remove()
    }

    /**
     * 
     * @param {Node} node
     * @param {String} nodeName
     * @param {String} position
     */
    insertAdjacentEmptyFormatNodes(node, nodeName, position){  

        const nodes = this.surroundingFormatNodes
        let currentNode, anchorNode

        for (const [elementName, value] of Object.entries(nodes)){

            if(value && elementName !== nodeName){

                const node = document.createElement(elementName)
                
                if(!currentNode){
                    currentNode = node
                    anchorNode = node
                    continue
                }

                currentNode.appendChild(node)
                currentNode = node
            }
        }

        if(!currentNode){
            this.setCaretAfterNode(node, window.getSelection())
            return
        }

        if(position === 'before'){
            node.parentNode.insertBefore(anchorNode, node)
        }else if(position === 'after'){
            node.after(anchorNode)
        }

        this.setCaret(0, currentNode)
    }


    /**
     * 
     * @param {Node} childnode
     * @param {String} nodeName 
     */

    getParentNode(childnode, nodeName){

        const paragraph = this.shadowRoot.querySelector('p')
        let node = childnode

        while( !node.isEqualNode(paragraph)){

            if(node.nodeName === nodeName){
                return node
            }   

            node = node.parentNode
        }
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
        const range = selection.getRangeAt(0)
        let node = range.startContainer
        const endNode = range.endContainer

        this.surroundingFormatNodes = {
            'B': false,           
            'I': false,             
            'U': false            
        }

        if(selection.isCollapsed || selection.anchorOffset === 0 && selection.focusOffset === selection.focusNode.length){

            while( node.tagName !== 'P'){

                if(node.nodeType === 3) {
                    node = node.parentNode 
                    continue
                }
    
                let tagName = node.tagName
    
                if(node.tagName === 'P'){
                    return
                }
    
                if(formatTagNames.includes( tagName )){
                    this.surroundingFormatNodes[ tagName ] = true
                }else{
                    this.surroundingFormatNodes[ tagName ] = false
                }
                node = node.parentNode 
            }
            return
        }

        if(this.editor.isEqualNode(range.commonAncestorContainer)){

            const childNodes = range.commonAncestorContainer.childNodes
            
            for(let i = 0,l = childNodes.length; i < l ; i++){
               
                let childNode = childNodes[i]

                if(childNode.contains(endNode)) {

                    this.checkForActiveFormatNodes(childNode)
                    break
                }

                this.checkForActiveFormatNodes(childNode)
            }

        }else {
            this.checkForActiveFormatNodes(range.commonAncestorContainer)
        }
    }

    /**
     * 
     * @param {Node} node 
     */

    checkForActiveFormatNodes(node){

        const formatTagNames = [ 'B', 'I', 'U']

        if(node.nodeType === 3){

            do {
                
                node = node.parentNode

                if(formatTagNames.includes(node.nodeName)){
                    this.surroundingFormatNodes[node.nodeName] = true
                }

            } while (!node.isEqualNode(this.editor))
            return
        }

        const nodeName = node.nodeName

        if(formatTagNames.includes(nodeName)){
            this.surroundingFormatNodes[nodeName] = true
        }

        if(node.childNodes) {

            node.childNodes.forEach( childNode => {
                this.checkForActiveFormatNodes(childNode)
            })

        }else {
            return
        }
    }

    /**
     * 
     * @param {String} exceptionNodeName 
     */
    setStatesForFormatButtons(exceptionNodeName){

        for (const [key, value] of Object.entries(this.surroundingFormatNodes)){

            const button = this.formatButtons[key]

            if( key === exceptionNodeName) continue

            if(value && key){
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