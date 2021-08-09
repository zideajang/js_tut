
// const element = (
//     <div id="foo">
//         <a>bar</a>
//         <b/>
//     </div>
// )

function createElement(type, props, ...children){
    return{
        type,
        props:{
            ...props,
            children: children.map(child => 
              typeof child === "object"
                ? child
                : createTextElement(child)  
                
            ),
        },
    }
}

function createTextElement(text){
    return {
        type: "TEXT_ELEMENT",
        props :{
            nodeValue: text,
            children: []
        }
    }
}

// function render(element, container){
//     // console.log("render phase")
//     const dom = element.type == "TEXT_ELEMENT"
//         ? document.createTextNode("")
//         : document.createElement(element.type);

//     const isProperty = key => key !== "children"
//     Object.keys(element.props)
//         .filter(isProperty)
//         .forEach(name => {
//             dom[name] = element.props[name]
//         })
//     element.props.children.forEach(child => 
//         render(child,dom)
//     )
//     container.appendChild(dom);
// }

function createDom(fiber){
    const dom = element.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);

    const isProperty = key => key != "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        });
    return dom;
}

function commitRoot(){
    //TODO add nodes to dom
}

function render(element, container){
    //TODO set next unit of work
    wipRoot = {
        dom:container,
        props:{
            children: [element]
        },
    }
    nextUnitOfWork = wipRoot
}


let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline){

    let shouldYield = false
    while( nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )

        shouldYield = deadline.timeRemaining() < 1
    }
    // 

    if(!nextUnitOfWork && wipRoot){
        commitRoot();
    }
    requestIdleCallback(workLoop)

}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }

    // if(!fiber.parent){
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }

    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;
    
    while (index < elements.length){
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        }

        if(index === 0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber;
        index++
    }
    //TODO add dom nodes
    //TODO create new fibers
    //TODO return next unit of work
    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber
    while(nextFiber){
        if (nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}
miniReact = {
    createElement,
    render
}

const element = miniReact.createElement(
    "div",
    {id:"foo"},
    miniReact.createElement("a",null,"bar"),
    miniReact.createElement("b")
)

/**@jsx miniReact.createElement */

// console.log(element)



const container = document.getElementById("root");
miniReact.render(element,container);