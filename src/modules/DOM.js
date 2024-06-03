import { noteBuilder, noteManipulator, projectBuilder, projectLibrary } from "./objectBuilder";

const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectName = document.getElementById('projectName');
const projectDialog = document.getElementById('projectDialog');
const projectForm = document.getElementById('projectForm');
const projectSubmitBtn = document.getElementById('projectSubmit');

const noteContainer = document.getElementById('noteContainer');
const noteDialog = document.getElementById('noteDialog');
const noteForm = document.getElementById('noteForm')
const noteTitle = document.getElementById('noteTitle');
const noteDescription = document.getElementById('noteDescription');
const noteDueDate = document.getElementById('noteDueDate');
const notePriority = document.getElementById('notePriority');
const noteSubmitBtn = document.getElementById('noteSubmit');

const editDialog = document.getElementById('editDialog');
const editForm = document.getElementById('editForm')
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editDueDate = document.getElementById('editDueDate');
const editPriority = document.getElementById('editPriority');
const editSubmitBtn = document.getElementById('editSubmit');

const cancelBtn = document.querySelectorAll('#cancel');

let selectedProject = ''
let editedNote = ''

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
        if (projectName.value == '')return;
        if(Object.hasOwn(projectLibrary, projectName.value) == true) {
            alert('Cannot repeat project name');
            return;
        };
        
        const projectBtnContainer = document.createElement('div')
        projectHeader.insertBefore(projectBtnContainer, newProjectBtn);
        // Imported from objectBuilder.js
        const project = projectBuilder(projectName.value); 
        // Local
        appendProjectBtn(projectName.value, projectBtnContainer);
        appendProjectDelete(project, projectBtnContainer)
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
    editSubmitBtn.addEventListener('click', submitEdit);

    function submitEdit(){
        noteManipulator.editor(selectedProject, editedNote, editTitle.value, editDescription.value, editDueDate.value, editPriority.value);
        noteLookUp();
        console.log(projectLibrary[selectedProject]);
    };

    const noteDisplay = () => {
        newNoteBtn.textContent = '+'
        newNoteBtn.addEventListener('click', openNoteDialog)
        noteLookUp();
        noteContainer.appendChild(noteInstance);
        noteContainer.appendChild(newNoteBtn);
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
        noteInstance.innerHTML = '';
        for(const key in projectLibrary[selectedProject]){
            const titleDisplay = document.createElement('div');
            titleDisplay.classList.add('titleDisplay');
            titleDisplay.textContent = projectLibrary[selectedProject][key].title;
            noteInstance.appendChild(titleDisplay);
            createEdit(key, titleDisplay);
            createDelete(key, titleDisplay);
            };

        function createEdit(key, titleDisplay) {
            const editBtn = document.createElement('button');
            editBtn.addEventListener('click', editNote);

            editBtn.classList.add('editBtn');
            editBtn.textContent = 'Edit';
            titleDisplay.appendChild(editBtn);

            function editNote(){
                editTitle.value = projectLibrary[selectedProject][key].title;
                editDescription.value = projectLibrary[selectedProject][key].description;
                editDueDate.value = projectLibrary[selectedProject][key].dueDate;
                editPriority.value = projectLibrary[selectedProject][key].priority;
                editDialog.open = true;
                editedNote = key;
                console.log(editedNote)
                // 
                console.log(projectLibrary[selectedProject][key])
            };
        };

        function createDelete(key, titleDisplay) {
            const deleteBtn = document.createElement('button');
            deleteBtn.addEventListener('click', deleteNote);
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.textContent = 'Delete';
            titleDisplay.appendChild(deleteBtn);

            function deleteNote(){
                noteManipulator.noteDeleter(selectedProject, key);
                titleDisplay.remove();
            };
        };
    };

return {noteDisplay};
    
})();

export {DOMCreator}