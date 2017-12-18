import Options from './project.default';

if(process.env.RUN_ENV === "production"){
    Object.assign(Options, require('./project.production'));
}else if(process.env.RUN_ENV ==="test"){
    Object.assign(Options, require('./project.test'));
}else{
    Object.assign(Options, require('./project.development'));
}

module.exports = Options;