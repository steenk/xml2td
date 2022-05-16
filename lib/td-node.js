
function node (td) {
    const self = this;
    let n = function () {};
    n.node = node;
    if (Array.isArray(td) && typeof td[0] === 'string') {
        n.type = 'element';
        n.tagname = td[0];
        n.content = td;
        n.text = td.slice(1).filter(x => { return typeof(x) !== 'object'}).join('');
        let attr = td.filter(x => { return typeof(x) === 'object' && !Array.isArray(x)});
        if (attr.length) {
            n.attributes = attr[0];
        } else {
            n.attributes = {};
        }
        return n;
    }
    if (self) {
        if (typeof td === 'string' && Array.isArray(self.content)) {
            let sub = self.content.filter(x => {return Array.isArray(x) && x[0] === td});
            if (sub.length === 1) {
                n.tagname = td;
                n.type = 'element';
                n.content = sub[0];
                n.size = 1;
                let attr = n.content.filter(x => { return typeof(x) === 'object' && !Array.isArray(x)});
                if (attr.length) n.attributes = attr[0];
                n.text = sub[0].slice(1).filter(x => { return typeof(x) !== 'object'}).join('');
            } else if (sub.length > 1) {
                n.tagname = td;
                n.type = 'fraction';
                n.content = sub;
                n.size = sub.length;
            }
        } else if (typeof td === 'number' && self.size) {
            let sub = node(self.content[td]);
            n.tagname = sub.tagname;
            n.type = sub.type;
            n.content = sub.content;
            if (sub.type === 'fraction') n.size = sub.size;
            n.text = sub.text;
            n.attributes = sub.attributes || {};
        } else if (Array.isArray(td) && typeof td[0] === 'string') {
            n.node.type = 'element';
            n.node.name = td[0];
        } else {
        }
    }
    return n;
}


// function node (td) {
//     let n = {
//         type: 'undefined',
//         names: () => [],
//         node
//     };
// 	/*if (typeof td !== 'object') {
// 		return {
// 			type: 'text',
// 			content: td
// 		}
// 	}*/
// 	if (!Array.isArray(td)) {
// 		return n;
// 	} else if (Array.isArray(td[0])) {
// 		//td = td[0];
// 		return n;
// 	}
  
//     n.node = function (name) {
//         if (n.size > 1) {
//             //n.type = 'fraction';
//             for (let e of n.content) {
//                 if (e[0] === name) {
//                     return node(e);
//                 }
//             }
//         } else {
//             if (n.content[0] === name) {
//                 return node(n.content);
//             }
//         }
//         return {
//             type: 'undefined',
//             names: () => [],
//             node
//         };
//     }
//     n.names = function () {
//         if (n.size > 1) {
//             return n.content.map(x => { return x[0]});
//         }
//         return [];
//     }
//     td = td.filter(x => !/^[\s\n]+/.test(x));
//     if (Array.isArray(td[0])) {
//     	n.type = 'fraction',
//     	n.content = td;
//     	return n;
//     }
//     if (/^\s+$/.test(td[0])) {
//         td.shift();
//     }
//     n.name = td[0];
//     n.type = 'element';
//     let cont;
//     if (typeof td[1] === 'object' && !Array.isArray(td[1])) {
//     	n.attributes = td[1];
//     	cont = 2;
//     } else {
//     	n.attributes = {};
//     	cont = 1;
//     }
//     n.content = td.slice(cont);
//     n.size = n.content.filter(x => Array.isArray(x)).length;
//     if (n.content.length === 1) {
//     	n.content = n.content[0];
//     }
//     return n;
// }


export default node;