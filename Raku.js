const createElement = (type, props, ...args) => {
    const children = args.length? [].concat(...args) : null
    return {
        type, props, children
    }
}

const render = (element, container) => {
  let node;
  if(typeof(element) !== 'object'){
    node = document.createTextNode(element) 
  }else{
    node = document.createElement(element.type)
    let attr = element.props || {};
    Object.keys(attr).map(k => node.setAttribute(k, attr[k]));
    (element.children || []).forEach(child => render(child, node))
  }
  container.appendChild(node)
  console.log(element)
}

/** @jsx createElement */

const element = (
    <div id='sumo'>
        <p id='col' style='color: red'>Welcome to Raku</p>
    </div>
);

render(element, document.getElementById('root'))