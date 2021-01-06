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
  updateDOM(node, {}, fiber.props);
  //[Not appending the child elemnts to the node]
  //fiber.props.children.map(child => render(child, node))
  return node;
};

const isEvent = (key) => key.startsWith("on");
const isProp = (key) => key !== "children" && !isEvent(key);
const destroyProps = (prev, next) => (key) => !(key in next);
const newProps = (prev, next) => (key) => prev[key] !== next[key];
const updateDOM = (dom, prevProps, nextProps) => {
  console.log("Update DOM: ", dom);
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || newProps(prevProps, nextProps)(key))
    .forEach((ev) => {
      const eventType = ev.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[ev]);
    });

  Object.keys(prevProps)
    .filter(isProp)
    .filter(destroyProps(prevProps, nextProps))
    .forEach((prop) => {
      dom[prop] = "";
    });
  Object.keys(nextProps)
    .filter(isProp)
    .filter(newProps(prevProps, nextProps))
    .forEach((prop) => {
      dom[prop] = nextProps[prop];
    });
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(newProps(prevProps, nextProps))
    .forEach((ev) => {
      const eventType = ev.toLowerCase().substring(2);
      console.log("EventType: ", eventType);
      dom.addEventListener(eventType, nextProps[ev]);
    });
};

const commitRoot = () => {
  //Commit the node into the dom
  deletes.forEach(commitWork);
  commitWork(wipRoot.child);
  rootRef = wipRoot;
  wipRoot = null;
  console.log("Commiting The nodes");
};

const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "CREATE" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DESTROY") {
    commitDelete(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const commitDelete = (fiber, domParent) => {
  fiber.dom && domParent.removeChild(fiber.dom);
  !fiber.dom && commitDelete(fiber.child, domParent);
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
  if (!nextWorkLoad && wipRoot) commitRoot();
  requestIdleCallback(workLoadLoop);
};

requestIdleCallback(workLoadLoop);

const performWorkLoad = (fiber) => {
  const isFuncComponent = fiber.type instanceof Function;
  if (isFuncComponent) {
    updateFuncCOmponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};

let wipFiber = null;
let hookIndex = null;

const updateFuncCOmponent = (fiber) => {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
};

const useState = (initialState) => {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action;
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: rootRef.dom,
      props: rootRef.props,
      alternate: rootRef
    };
    nextWorkLoad = wipRoot;
    deletes = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
};

const updateHostComponent = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
};

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  console.log("OLDFIBER: ", oldFiber);
  let prevSibling = null;
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }

    !sameType &&
      element &&
      (newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        alternate: null,
        parent: wipFiber,
        effectTag: "CREATE"
      });

    if (!sameType && oldFiber) {
      oldFiber.effectTag = "DESTROY";
      deletes.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
};

 export  { createElement, render, useState };
/** @jsx createElement */
