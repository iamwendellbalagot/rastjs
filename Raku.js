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

const render = (element, container) => {
  const node = element.type === 'plainText' ? document.createTextNode('')
    : document.createElement(element.type)
  Object.keys(element.props ).filter(key => key !== 'children')
    .map(c => node[c] = element.props[c])
  element.props.children.map(child => render(child, node))
  container.appendChild(node);
}

/** @jsx createElement */

const container = document.getElementById('root');

let el = <div id='test' >
  <h1>Welcome</h1>
  <div>Hello World</div>
</div>

render(el, container)