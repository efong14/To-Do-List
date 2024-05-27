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
        const projectBtnContainer = document.createElement('div')
        projectHeader.insertBefore(projectBtnContainer, newProjectBtn);
        // Imported from objectBuilder.js
        const project = projectBuilder(projectName.value); 
        // Local
        appendProjectBtn(projectName.value, projectBtnContainer);
        appendProjectDelete(project, projectBtnContainer)
    // Remove when done
        console.log(projectLibrary)
    };

    function appendProjectBtn(name, parent){
        const projectBtn = document.createElement('button');
        projectBtn.textContent = `${name}`;
        projectBtn.setAttribute('id', name);
        projectBtn.addEventListener('click', noteDisplaySetter);
        parent.appendChild(projectBtn)

        function noteDisplaySetter() {
            selectedProject = name;
            newNote.noteDisplay();
        }
    };

    function appendProjectDelete(project, parent){
        const projectDeleteBtn= document.createElement('button');
        projectDeleteBtn.textContent = 'X';
        projectDeleteBtn.classList.add('projectDeleteBtn')
        projectDeleteBtn.addEventListener('click', deleteProject);
        parent.appendChild(projectDeleteBtn)

        function deleteProject() {
            project.projectDeleter();
            parent.remove();
        };
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
        noteLookUp(note);
    };

    function openNoteDialog() {
        noteDialog.open = true;
        noteForm.reset();
    };

    function buildNote() {
        const note = noteBuilder(noteTitle.value, noteDescription.value, noteDueDate.value, notePriority.value);
        note.noteAdder(selectedProject);
        noteInstance.innerHTML = ''
        noteLookUp(note);
    };

    function noteLookUp(note) {

        for(const key in projectLibrary[selectedProject]){
            const titleDisplay = document.createElement('div');
            titleDisplay.classList.add('titleDisplay');
            titleDisplay.textContent = key;
            noteInstance.appendChild(titleDisplay);
            createEdit(key, titleDisplay);
            createDelete(key, titleDisplay);
            };

        function createEdit(key, titleDisplay) {
            const editBtn = document.createElement('button');
            editBtn.addEventListener('click', editNote);
            editBtn.classList.add('editBtn');
            editBtn.setAttribute('edit', key);
            editBtn.textContent = 'Edit'
            titleDisplay.appendChild(editBtn);

        function editNote(){
            console.log(this.getAttribute('edit'))
            };
        };

        function createDelete(key, titleDisplay) {
            const deleteBtn = document.createElement('button');
            deleteBtn.addEventListener('click', deleteNote);
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.setAttribute('delete', key);
            deleteBtn.textContent = 'Delete'
            titleDisplay.appendChild(deleteBtn);

            function deleteNote(){
                note.noteDeleter(selectedProject);
                titleDisplay.remove()
            };
        };
    };
    
    return {noteDisplay}
})();

export {DOMCreator}