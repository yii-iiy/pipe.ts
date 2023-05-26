# pipe.ts

~~~
🐚 pipe like promise for TS 🍥
~~~

test: 

~~~ ts
var y, z;
const result = new Pipe(1)
    .then(x => x + 1)
    .then(x => x * x)
    .then(x => x.toString())
    .then(x => x.toString())
    .run()
    .then(x => x + 5)
    .then(x => x + 0)
    .pop(x => (y = x + 1))
    .pop(x => (z = x + 1))
    .then(x => x + "c")
    .run()
    .pop();

console.log(result); // "450c"
console.log(y); // "4501"
console.log(z); // "4501"
~~~
