const projectLibrary = {}
class Project {
    constructor(name) {
        this.name = name
        projectLibrary[`${name}`] = this
    }
};

export {Project, projectLibrary}