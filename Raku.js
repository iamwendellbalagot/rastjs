// const render = (element, container) => {
//   const node = element.type === 'plainText' ? document.createTextNode('')
//     : document.createElement(element.type)
//   Object.keys(element.props ).filter(key => key !== 'children')
//     .map(c => node[c] = element.props[c])
//   element.props.children.map(child => render(child, node))
//   container.appendChild(node);
//   console.log(element)
// }

const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child !== "object" ? createTextElement(child) : child
    )
  }
});

const createTextElement = (text) => ({
  type: "plainText",
  props: { nodeValue: text, children: [] }
});

const createDOM = (fiber) => {
  const node =
    fiber.type === "plainText"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .map((c) => (node[c] = fiber.props[c]));
  //[Not appending the child elemnts to the node]
  //fiber.props.children.map(child => render(child, node))
  return node;
};

const isProp = key => key !== 'children';
const destroyProps = (prev, next) => key => !(key in next);
const newProps = (prev, next) => key => prev[key] !== next[key];
const updateDOM = (dom, prevProps, nextProps) => {
  Object.keys(prevProps).filter(isProp).filter(destroyProps)
    .map(prop => dom[prop] = '');
  Object.keys(nextProps).filter(isProp).filter(newProps)
    .map(prop => dom[prop] = nextProps[prop]);
}

const commitRoot = () => {
  //Commit the node into the dom
  deletes.forEach(commitWork)
  commitWork(wipRoot.child);
  rootRef = wipRoot;
  wipRoot = null;
  console.log("Commiting The nodes");
};

const commitWork = (fiber) => {
  if (!fiber) return;
  const domParent = fiber.parent.dom;
  (fiber.effectTag === 'CREATE' && fiber.dom) 
    && domParent.appendChild(fiber.dom);
  (fiber.effectTag === 'DESTROY') && domParent.removeChild(fiber.dom);
  (fiber.effectTag === 'UPDATE' && fiber.dom)
    && (updateDOM(fiber.dom, fiber.alternate.props, fiber.props)); 
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: rootRef
  };
  deletes = [];
  nextWorkLoad = wipRoot;
};

let nextWorkLoad = null;
let rootRef = null;
let wipRoot = null;
let deletes = null;
const workLoadLoop = (deadline) => {
  let yieldStatus = false;
  while (nextWorkLoad && !yieldStatus) {
    nextWorkLoad = performWorkLoad(nextWorkLoad);
    yieldStatus = deadline.timeRemaining() < 1;
    console.log("Next LOAD: ", yieldStatus, nextWorkLoad);
  }
  !nextWorkLoad && wipRoot && commitRoot();
  requestIdleCallback(workLoadLoop);
};

requestIdleCallback(workLoadLoop);

const performWorkLoad = (fiber) => {
  !fiber.dom && (fiber.dom = createDOM(fiber));

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
};
const reconcileChildren = (fiber, elements) => {
  let index = 0;
  let oldFiber = fiber.alternate && fiber.alternate.child;
  let prevSibling = null;
  while (index < elements.length || oldFiber) {
    let element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    sameType &&
      (newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      });

    !sameType &&
      element &&
      (newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        alternate: null,
        parent: fiber,
        effectTag: 'CREATE'
      });

    (!sameType && oldFiber) && (
      oldFiber.effectTag = 'DESTROY',
      deletes.push(oldFiber)
    );

    index === 0 && (fiber.child = newFiber);
    index !== 0 && (prevSibling.sibling = newFiber);
    prevSibling = newFiber;
    index++;
  }
};

/** @jsx createElement */

const container = document.getElementById("root");

let el = (
  <div id="test">
    <h1>Welcome</h1>
    <div>Hello Worldd</div>
    <input />
  </div>
);

render(el, container);
