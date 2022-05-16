# xml2td

This is a simple module for converting XML to JSON in a tripledollar structure fashion. It means a nested array structure where the first item in each array is the name of the element, and the second is optionally an object with all attributes. The rest of the items in an array can be text content, or other arrays. This way to represent an XML as a JSON string maps with any XML structure, and it's easy to convert back and forth. There is a reverse function "td2xml" also, apart from the default function.

```js
import xml2td, { td2xml } from 'xml2td';

let str = '<root><example><test nr="2">hello</test></example></root>';
let td = xml2td(str);
console.log(td);
let xml = td2xml(td);
console.log(xml);

```

## XML nodes

The "tdstruct" representation of an XML can map any XML, but it is bad as a structure to work with, there is no keys to access, just nested lists. To make it more usable, there is a method to get a "node" out of a "tdstruct". THe "node" method is chainable, so it can be used to travers a "tdstruct".

```js
import xml2td, { td2xml, node } from 'xml2td';

let str = '<root><example><test nr="2">hello</test></example></root>';
let td = xml2td(str);
let testnode = node(td).node('example').node('test');
console.log(testnode.type); // element
console.log(testnode.size); // 1
console.log(testnode.text); // hello

let str2 = '<root><example><test nr="2" /><test /><test /></example></root>';
let td2 = xml2td(str2);
let fraction = node(td2).node('example').node('test');
console.log(fraction.type); // fraction
console.log(fraction.size); // 3
let first = fraction.node(0);
console.log(first.type); // element
console.log(first.attributes)  // {nr: 2}
console.log(first.attributes.nr) // 2
```

The node method can take different type of parameters. When the it is fed an array, it assumes it is a "tdstruct", when it is a "string" it finds the element child with that name, when it is a number it finds one node in a fraction (list of elements).