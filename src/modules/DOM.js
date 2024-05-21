import { projectBuilder, projectLibrary } from "./objectBuilder";

const form = document.querySelector('form');
const noteContainer = document.getElementById('noteContainer');
const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectDialog = document.getElementById('projectDialog');
const projectName = document.getElementById('projectName');
const submitBtn = document.getElementById('submit')
const cancelBtn = document.getElementById('cancel')

const DOMCreator = (function() {
    newProjectBtn.addEventListener('click', openProjectDialog);
    submitBtn.addEventListener('click', buildProject);
    cancelBtn.addEventListener('click', cancelDialog);
    
    function openProjectDialog() {
        projectDialog.open = true;
        form.reset();
    };

    function cancelDialog(event){
        event.preventDefault();
        projectDialog.close();
    };

    function buildProject(){
        if (projectName.value == ''){return};
        var name = projectName.value;
        projectBuilder(name); 
        appendProject(name);
    // Remove when done
        console.log(projectLibrary)
    };

    function appendProject(name){
        const projectBtn = document.createElement('button');
        projectBtn.textContent = `${name}`;
        projectBtn.setAttribute('id', name);
        projectHeader.insertBefore(projectBtn, newProjectBtn);
        projectBtn.addEventListener('click', newNote.noteDisplay);
    };
})();

const newNote = (function () {
    const noteDisplay = () => {
        const noteInstance = document.createElement('div');
        const newNoteBtn = document.createElement('button');
        noteContainer.textContent = '';
        noteInstance.textContent = `${projectLibrary[projectName.value]}`;
        noteContainer.appendChild(noteInstance);

    };
    return {noteDisplay}
})();

export {DOMCreator}