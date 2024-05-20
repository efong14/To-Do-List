import { projectBuilder, projectLibrary } from "./objectBuilder";

const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectDialog = document.getElementById('projectDialog');
const form = document.querySelector('form');
const projectName = document.getElementById('projectName');
const submitBtn = document.getElementById('submit')
const cancelBtn = document.getElementById('cancel')

const newProject = (function() {
    newProjectBtn.addEventListener('click', openProjectDialog);
    submitBtn.addEventListener('click', buildProject);
    cancelBtn.addEventListener('click', cancelDialog);
    
    function openProjectDialog() {
        projectDialog.open = true;
        form.reset();
    };

    function buildProject(){
        var name = projectName.value;
        projectBuilder(name); 
        appendProject(name);
    // Remove when done
        console.log(projectLibrary)
    };

    function appendProject(name){
        const projectText = document.createElement('button');
        projectText.textContent = `${name}`;
        projectText.setAttribute('id', name);
        projectHeader.insertBefore(projectText, newProjectBtn);
    };

    function cancelDialog(event){
        event.preventDefault();
        projectDialog.close();
    };

})();

export {newProject}