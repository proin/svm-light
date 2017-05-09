'ust strict';

module.exports = (()=> {
    const path = require('path');

    let terminal = (cmd, args, data, err)=> new Promise((resolve)=> {
        let _spawn = require('child_process').spawn;
        if (process.platform == 'win32')
            _spawn = require('cross-spawn');

        let term = _spawn(cmd, args);

        term.stdout.on('data', data ? data : ()=> {
        });

        term.stderr.on('data', err ? err : ()=> {
        });

        term.on('close', () => {
            resolve();
        });
    });

    let app = {};
    
    let learn = null;
    let classify = null;
    let BIN_PATH = path.join(__dirname, 'bin', 'svm-light');
    
    app.model = (type)=> {
        if(type == 'multiclass')
            BIN_PATH = path.join(__dirname, 'bin', 'svm-light-multiclass');
        else
            BIN_PATH = path.join(__dirname, 'bin', 'svm-light');

        switch (process.platform) {
            case 'win32':
                learn = path.join(BIN_PATH, 'svm_learn.exe');
                classify = path.join(BIN_PATH, 'svm_classify.exe');
                break;
            case 'darwin':
                learn = path.join(BIN_PATH, 'svm_learn_darwin');
                classify = path.join(BIN_PATH, 'svm_classify_darwin');
                break;
            case 'linux':
                if (process.arch == 'x64') {
                    learn = path.join(BIN_PATH, 'svm_learn_linux64');
                    classify = path.join(BIN_PATH, 'svm_classify_linux64');
                } else {
                    learn = path.join(BIN_PATH, 'svm_learn_linux32');
                    classify = path.join(BIN_PATH, 'svm_classify_linux32');
                }
                break;
        }
    };

    app.model();

    app.learn = (opts)=> new Promise((resolve)=> {
        if (!opts) opts = {};

        let {input, model, data, error} = opts;

        delete opts.input;
        delete opts.model;
        delete opts.data;
        delete opts.err;

        let env = [];
        for(let key in opts) {
            env.push(`-${key}`);
            env.push(opts[key]);
        }
        env.push(input);
        env.push(model);

        terminal(learn, env, data, error).then(resolve);
    });

    app.classify = (opts)=> new Promise((resolve)=> {
        if (!opts) opts = {};
        terminal(classify, [
            opts.input,
            opts.model,
            opts.result
        ], opts.data, opts.error).then(resolve);
    });

    return app;
})();
