
// const render = (element, container) => {
//   const node = element.type === 'plainText' ? document.createTextNode('')
//     : document.createElement(element.type)
//   Object.keys(element.props ).filter(key => key !== 'children')
//     .map(c => node[c] = element.props[c])
//   element.props.children.map(child => render(child, node))
//   container.appendChild(node);
//   console.log(element)
// }

const createElement = (type, props, ...children) => (
  {type, props: {...props, children: children.map( child =>
    typeof child !== 'object'? createTextElement(child) : child  
  )}}
);

const createTextElement = (text) => (
  {
    type: 'plainText',
    props: {nodeValue: text, children:[]}
  }
);

const createDOM = (fiber) => {
  const node = fiber.type === 'plainText' ? document.createTextNode('')
    : document.createElement(fiber.type)
  Object.keys(fiber.props ).filter(key => key !== 'children')
    .map(c => node[c] = fiber.props[c])
  //[Not appending the child elemnts to the node]  
    //fiber.props.children.map(child => render(child, node))
  return node;
}

const commitRoot = () => {
  //Commit the node into the dom
  commitWork(wipRoot.child)
  rootRef = wipRoot;
  wipRoot = null;
  console.log('Commiting The nodes')
}

const commitWork = (fiber) => {
  if(!fiber) return;
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: rootRef
  };
  nextWorkLoad = wipRoot;
}

let nextWorkLoad = null;
let rootRef = null;
let wipRoot = null;
const workLoadLoop = (deadline) => {
  let yieldStatus = false;
  while(nextWorkLoad && !yieldStatus){
    nextWorkLoad = performWorkLoad(nextWorkLoad)
    yieldStatus = deadline.timeRemaining() < 1;
    console.log('Next LOAD: ',yieldStatus,nextWorkLoad)
  }
  (!nextWorkLoad && wipRoot) && commitRoot();
  requestIdleCallback(workLoadLoop)
}

requestIdleCallback(workLoadLoop)

const performWorkLoad = (fiber) => {
  !fiber.dom && (fiber.dom = createDOM(fiber));

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while(index < elements.length){
    let element = elements[index];
    let newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };
    index === 0 && (fiber.child = newFiber);
    index !== 0 && (prevSibling.sibling = newFiber);
    prevSibling = newFiber;
    index++;
  }
  if(fiber.child) return fiber.child;
  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

/** @jsx createElement */

const container = document.getElementById('root');

let el = <div id='test' >
  <h1>Welcome</h1>
  <div>Hello Worldd</div>
  <input />
</div>

render(el, container)