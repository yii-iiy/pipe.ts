const memoize = 
<T extends (...args: any[]) => any>(fn: T)
: T => 
{
    const cache: Record<string, ReturnType<T>> = {};

    return ((...args: Parameters<T>)
    : ReturnType<T> => 
    {
        const key = JSON.stringify(args) ;
        if (!(key in cache)) 
        { cache[key] = fn(...args); } ;
        return cache[key] ;
    }) as T ;
} ;

const fib = memoize((n: number): number => (n <= 1 ? n : fib(n - 1) + fib(n - 2)) ) ;
console.log(fib(40)) ;
console.log(fib(40)) ;

// const fsleep = (n: number): number => sleep ;
// const memoizedFsleep = memoize(fsleep);

// console.log(memoizedFsleep(40));
// console.log(memoizedFsleep(40));


type F<T, R> = (p: T) => R ;

export 
class Pipe
<T> 
{
    constructor 
    (private value: T, private fns: F<any, any>[] = []) 
    {} ;
    
    then = 
    <R,>(fn: F<T, R>)
    : Pipe<R> => 
    {
        this.fns.push(fn);
        return (this as unknown) as Pipe<R> ;
    } ;
    
    private static piperun = memoize
    (
        <T,> (fs: F<any, any>[], v: T)
        : T => 
            fs.reduce((r, f) => f(r), v)
    ) ;
    
    private runfn = 
    ()
    : T => 
        
        Pipe.piperun(this.fns, this.value) ;
    
    run = 
    ()
    : Pipe<T> => 
        
        new Pipe(this.runfn()) ;
    
    
    pop(): T ;
    pop<R>(fn: F<T, R>): Pipe<T> ;
    pop
    <R,>
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
    // .run()
    .pop();

console.log(result);
console.log(y);
console.log(z);
