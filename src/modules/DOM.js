import { noteBuilder, projectBuilder, projectLibrary } from "./objectBuilder";

const noteContainer = document.getElementById('noteContainer');
const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectDialog = document.getElementById('projectDialog');
const projectForm = document.getElementById('projectForm')
const noteDialog = document.getElementById('noteDialog');
const noteForm = document.getElementById('noteForm')
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
        projectForm.reset();
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

    noteInstance.classList.add('noteInstance')
    newNoteBtn.classList.add('newNoteBtn');
    noteSubmitBtn.addEventListener('click', buildNote);

    const noteDisplay = () => {
        newNoteBtn.textContent = '+'
        newNoteBtn.addEventListener('click', openNoteDialog)
        noteInstance.innerHTML = '';
        noteContainer.appendChild(noteInstance);
        noteContainer.appendChild(newNoteBtn);
        noteLookUp();
    };

    function openNoteDialog() {
        noteDialog.open = true;
        noteForm.reset();
    };

    function buildNote() {
        const note = noteBuilder(noteTitle.value, noteDescription.value, noteDueDate.value, notePriority.value);
        note.noteAdder(selectedProject);
        noteInstance.innerHTML = ''
        noteLookUp();
    };

    function noteLookUp() {
        for(const key in projectLibrary[selectedProject]){
            const titleDisplay= document.createElement('div');
            const editBtn = document.createElement('button');
            editBtn.addEventListener('click', edit);
            titleDisplay.classList.add('titleDisplay');
            editBtn.classList.add('editBtn');
            editBtn.setAttribute('editable', key)
            titleDisplay.textContent = key;
            noteInstance.appendChild(titleDisplay);
            titleDisplay.appendChild(editBtn);
            };
        function edit(){
            console.log(this.getAttribute('editable'))
        }
        };

    return {noteDisplay}
})();

export {DOMCreator}