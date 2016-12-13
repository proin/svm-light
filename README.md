## SVM Light Multiclass Wrapper for Node.js

### Installation

```bash
npm install --save svm-light
```

### How To Use

learn & classify function available. All the functions are promise object. See below.

```javascript
let {learn, classify} = require('svm-light');

learn({
    // file path for input, model
    input: 'train.dat',
    model: 'model.dat',
    // on stream process data in here
    data: (data)=> {
        console.log(data + '');
    },
    // on error here
    error: (err)=> {
        console.log(err + '');
    },
}).then(()=> {
    // if finished, something do in here!    
});

classify({
    // file path for input, model, result
    input: 'test.txt',
    model: 'model.dat',
    result: 'result.txt',
    // on stream data in here
    data: (data)=> {
        console.log(data + '');
    },
    // on error here
    error: (err)=> {
        console.log(err + '');
    }
}).then(()=> {
    // if finished, something do in here!
})
```

### Using Options in Training

- available options
    - `c`: default 0.01
    - `v`: default 1
    - `y`: default 0
    - `p`: default 1
    - `o`: default 2
    - more detail info in [here](http://www.cs.cornell.edu/people/tj/svm_light/svm_multiclass.html)

```javascript
let {learn, classify} = require('svm-light');

learn({
    input: 'yeast_4.txt',
    model: 'model.dat',
    // apply options like this 
    c: 500,
    v: 1,
    data: (data)=> {
        console.log(data + '');
    },
    error: (err)=> {
        console.log(err + '');
    },
}).then(()=> {
    // if finished, something do in here!    
});
```
