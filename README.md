# xml2td

This is a simple module for converting XML to JSON in a tripledollar structure fashion. It means a nested array structure where the first item in each array is the name of the element, and the second is optionally an object with all attributes. The rest of the items in an array can be text content, or other arrays. This way to represent an XML as a JSON string maps with any XML structure, and it's easy to convert back and forth. There is a reverse function "td2xml" also, apart from the default function.

```js
import xml2td, { td2xml } from 'xml2td';

let str = '<root><test nr="2">hello</test></root>';
let td = xml2td(str);
console.log(td);
let xml = td2xml(JSON.parse(td));
console.log(xml);

```
