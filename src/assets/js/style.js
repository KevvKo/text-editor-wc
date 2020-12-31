export const style = `
<style>
#text-editor{
    width: 500px;
    height: 350px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #D2D2D2; 
}

.toolbox-button{
    display: inline-block;
    padding: 2px;
    margin: 4px;
    border-radius: 3px;
}

.active{
    background: #DADADA;
}

.active img{
    filter: invert(42%) sepia(85%) saturate(458%) hue-rotate(161deg) brightness(93%) contrast(83%);
}

.toolbox-button:hover{
    cursor: pointer;
    transition: 0.1s;
    background: #DADADA;
}

#underlined{
    padding-right: 4px;
    margin-right: 0;
    border-right: 1px solid #DADADA;
}

#content{ 
    border: none;
    border-top: 1px solid #D2D2D2; 
    padding: 10px;
    flex-grow: 2; 
    word-break: break-all;
    resize: none;
}
</style>
`