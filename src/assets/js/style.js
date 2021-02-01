export const style = `
<style>
#text-editor{
    width: 500px;
    height: 350px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #A8A8A8; 
}

#toolbox{
    display: flex;
    margin: 2px;
}

.toolbox-section{
    width: max-content;
    padding: 3px;
}

.toolbox-section:first-child{
    border-right: 1px solid #A8A8A8; 
}


.toolbox-button{
    display: inline-block;
    padding: 2px;
    border-radius: 3px;
    transition: 0.1s;
}

.toolbox-button:hover{
    cursor: pointer;
    background: #A8A8A8;
}

.toolbox-button img{
    transition: 0.1s;
}

.active{
    background: #A8A8A8;
}

.active img{
    filter: invert(42%) sepia(85%) saturate(458%) hue-rotate(161deg) brightness(93%) contrast(83%);
}

#content{ 
    border: none;
    border-top: 1px solid #A8A8A8; 
    padding: 10px;
    flex-grow: 2; 
    word-break: break-all;
    resize: none;
}

#content p{
    margin: 4px;
}

</style>
`