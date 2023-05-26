type F<T, R> = (p: T) => R ;

export 
class Pipe
<T> 
{
    constructor 
    (private value: T, private fns: F<any, any>[] = []) 
    {} ;
    
    then
    <R>(fn: F<T, R>)
    : Pipe<R> 
    {
        this.fns.push(fn);
        return (this as unknown) as Pipe<R> ;
    } ;
    
    private runfn
    ()
    : T 
    {
        return this
            .fns
            .reduce
            (
                (result, fn) => 
                    fn(result), this.value
            ) ;
    } ;
    
    run
    ()
    : Pipe<T> 
    {
        return new Pipe(this.runfn()) ;
    } ;
    
    pop(): T ;
    pop<R>(fn: F<T, R>): Pipe<T> ;
    pop
    <R>
    (fn?: F<T, R>)
    : T | Pipe<T> 
    {
        if (fn) 
        {
            fn(this.runfn()) ;
            return new Pipe(this.value, this.fns) ;
        } else 
        {
            return this.value ;
        } ;
    } ;
} ;


// use

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
