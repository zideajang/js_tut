class TutElement extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
        <style>

        </style>
        <h3 part="title">Tut custom Element Title</h3>
        <title-element exportparts="title"></title-element>
        `
    }
}

class TitleElement extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
        <h3 part="title">Title custom Element Title</h3>
        
        `
    }
}

customElements.define('tut-element',TutElement)

customElements.define('title-element',TitleElement)