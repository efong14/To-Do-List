import { noteBuilder, projectBuilder, projectLibrary } from "./objectBuilder";

const form = document.querySelector('form');
const noteContainer = document.getElementById('noteContainer');
const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectDialog = document.getElementById('projectDialog');
const noteDialog = document.getElementById('noteDialog');
const projectName = document.getElementById('projectName');
const noteTitle = document.getElementById('noteTitle');
const noteDescription = document.getElementById('noteDescription');
const noteDueDate = document.getElementById('noteDueDate');
const notePriority = document.getElementById('notePriority');
const projectSubmitBtn = document.getElementById('projectSubmit')
const noteSubmitBtn = document.getElementById('noteSubmit')
const cancelBtn = document.querySelectorAll('#cancel')

var selectedProject = ''

const DOMCreator = (function() {
    newProjectBtn.addEventListener('click', openProjectDialog);
    projectSubmitBtn.addEventListener('click', buildProject);
    cancelBtn.forEach((button) => button.onclick = () => cancelDialog);
    
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
        projectBuilder(projectName.value); 
        appendProject(projectName.value);
    // Remove when done
        console.log(projectLibrary)
    };

    function appendProject(name){
        const projectBtn = document.createElement('button');
        projectBtn.textContent = `${name}`;
        projectBtn.setAttribute('id', name);
        projectHeader.insertBefore(projectBtn, newProjectBtn);
        projectBtn.addEventListener('click', noteDisplaySetter);

        function noteDisplaySetter() {
            selectedProject = name;
            newNote.noteDisplay();
        }
    };
})();

const newNote = (function () {
    const noteInstance = document.createElement('div');
    const newNoteBtn = document.createElement('button');

    noteSubmitBtn.addEventListener('click', buildNote)

    function openNoteDialog() {
        noteDialog.open = true;
        form.reset();
    };

    function buildNote() {
        const note = noteBuilder(noteTitle.value, noteDescription.value, noteDueDate.value, notePriority.value);
        note.noteAdder(selectedProject);
        noteInstance.textContent = `${projectLibrary[selectedProject]}`;
    }

    const noteDisplay = () => {
        newNoteBtn.textContent = '+'
        newNoteBtn.addEventListener('click', openNoteDialog)
        noteContainer.textContent = '';
        // noteInstance.textContent = `${projectLibrary[selectedProject]}`; REMOVE
        noteContainer.appendChild(noteInstance);
        noteContainer.appendChild(newNoteBtn);
    };

    // Make New Function that loops through each of the selected project's objects and renders its title in the noteInstance field.

    const displayTest = () => {console.log('Works!')}
    return {noteDisplay, displayTest}
})();

export {DOMCreator}