import Options from './project.default';

if (process.env.NODE_ENV === 'production') {
    Object.assign(Options, require('./project.production'));
} else {
    Object.assign(Options, require('./project.development'));
}

module.exports = Options;