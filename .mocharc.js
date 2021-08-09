'use strict';

module.exports = {
    diff: true,
    extension: ['js'],
    package: './package.json',
    reporter: 'landing',
    slow: 75,
    timeout: 2000,
    ui: 'bdd',
    watchFiles: ['src/tests/*.js', 'src/tests/**/*.js'],
};