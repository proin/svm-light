module.exports = (()=> {
    'use strict';

    const path = require('path');

    const BIN_PATH = path.join(__dirname, 'bin');

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

    let learn = null;
    let classify = null;
    switch (process.platform) {
        case 'win32':
            learn = path.join(BIN_PATH, 'svm_multiclass_learn.exe');
            classify = path.join(BIN_PATH, 'svm_multiclass_classify.exe');
            break;
        case 'darwin':
            learn = path.join(BIN_PATH, 'svm_multiclass_learn_darwin');
            classify = path.join(BIN_PATH, 'svm_multiclass_classify_darwin');
            break;
        case 'linux':
            if (process.arch == 'x64') {
                learn = path.join(BIN_PATH, 'svm_multiclass_learn_linux64');
                classify = path.join(BIN_PATH, 'svm_multiclass_classify_linux64');
            } else {
                learn = path.join(BIN_PATH, 'svm_multiclass_learn_linux32');
                classify = path.join(BIN_PATH, 'svm_multiclass_classify_linux32');
            }
            break;
    }

    let app = {};

    app.learn = (opts)=> new Promise((resolve)=> {
        if (!opts) opts = {};
        terminal(learn, [
            '-c', opts.c ? opts.c : 0.01,
            '-v', opts.v ? opts.v : 1,
            '-y', opts.y ? opts.y : 0,
            '-p', opts.p ? opts.p : 1,
            '-o', opts.o ? opts.o : 2,
            opts.input, opts.model
        ], opts.data, opts.error).then(resolve);
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