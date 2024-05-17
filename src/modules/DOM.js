import { projectBuilder, projectLibrary } from "./objectBuilder";

const newProject = (function() {
    document.getElementById('newProject').addEventListener('click', () => build());

    function build(){
        var name = prompt('Project Name')
        projectBuilder(name);
    // Remove when done
        console.log(projectLibrary)
    };

})();

export {newProject}