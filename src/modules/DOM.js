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

const allBtn = document.getElementById('all')
const cancelBtn = document.querySelectorAll('#cancel');

let selectedProject = ''
let selectedNote = ''
let selectedAll = 'no'

const DOMCreator = (function() {
    newProjectBtn.addEventListener('click', openProjectDialog);
    projectSubmitBtn.addEventListener('click', buildProject);
    allBtn.addEventListener('click', displayAll);
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
        const project = projectBuilder(projectName.value); 
        appendProjectBtn(projectName.value, projectBtnContainer);
        appendProjectDelete(project, projectBtnContainer);
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

    function appendProjectBtn(name, parent){
        const projectBtn = document.createElement('button');
        projectBtn.textContent = `${name}`;
        projectBtn.setAttribute('id', name);
        projectBtn.addEventListener('click', noteDisplaySetter);
        parent.appendChild(projectBtn)

        function noteDisplaySetter() {
            selectedAll = 'no'
            selectedProject = name;
            noteCreator.clearDisplay();
            noteCreator.newNoteBtnAppend();
            for(const key in projectLibrary[name]){
                selectedNote = key
                noteCreator.showNote(key);
            };
        };
    };

    function displayAll(){
        noteCreator.clearDisplay();
        selectedAll = 'yes'
        for(const key in projectLibrary){
            selectedProject = key;
            noteCreator.noteDisplay();
        };
    };
})();

const noteCreator = (function () {
    const noteInstance = document.createElement('div');
    const newNoteBtn = document.createElement('button');
    noteInstance.classList.add('noteInstance')
    newNoteBtn.classList.add('newNoteBtn');
    noteSubmitBtn.addEventListener('click', buildNote);


    function clearDisplay(){
        noteInstance.innerHTML = '';
    };

    const newNoteBtnAppend = () => {
        newNoteBtn.textContent = '+';
        newNoteBtn.addEventListener('click', openNoteDialog);
        // noteLookUp();
        noteContainer.appendChild(noteInstance);
        noteContainer.appendChild(newNoteBtn);

        function openNoteDialog() {
            noteDialog.open = true;
            noteForm.reset();
        };
    };

    function buildNote() {
        if(noteTitle.value == '') {
            alert('Please input a title');
            return;
        };
        const note = noteBuilder(noteTitle.value, noteDescription.value, noteDueDate.value, notePriority.value);
        selectedNote = noteTitle.value;
        note.noteAdder(selectedProject);
        showNote(noteTitle.value);
    };

    const showNote = (note) => {
        let currentProject = selectedProject;
        let currentNote = selectedNote;

        const titleContainer = document.createElement('div');
        titleContainer.classList.add('titleContainer');
        noteInstance.appendChild(titleContainer);

        const titleDisplay = document.createElement('div');
        titleDisplay.classList.add('titleDisplay');
        titleDisplay.setAttribute('id', `${selectedNote}`);
        titleDisplay.textContent = projectLibrary[selectedProject][note].title;
        titleContainer.appendChild(titleDisplay);
        
        createEdit(titleContainer);
        createDelete(titleContainer);

        function createEdit(parent) {
            const editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.textContent = 'Edit';
            parent.appendChild(editBtn);
            editBtn.addEventListener('click', editNote);
            editSubmitBtn.addEventListener('click', submitEdit);

            function editNote(){
                selectedProject = currentProject;
                selectedNote = currentNote;
                console.log(titleDisplay);
                editTitle.value = projectLibrary[selectedProject][selectedNote].title;
                editDescription.value = projectLibrary[selectedProject][selectedNote].description;
                editDueDate.value = projectLibrary[selectedProject][selectedNote].dueDate;
                editPriority.value = projectLibrary[selectedProject][selectedNote].priority;
                editDialog.open = true;
                };

            function submitEdit(){
                if(editTitle.value == '') {
                    alert('Please input a title');
                    return;
                };
                noteManipulator.editor(selectedProject, selectedNote, editTitle.value, editDescription.value, editDueDate.value, editPriority.value);
                document.getElementById(`${selectedNote}`).textContent = editTitle.value;
            };
        };

        function createDelete(parent) {
            const deleteBtn = document.createElement('button');
            // deleteBtn.addEventListener('click', deleteNote);
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.textContent = 'Delete';
            parent.appendChild(deleteBtn);

            function deleteNote(){
                noteManipulator.noteDeleter(selectedProject, selectedNote);
                parent.remove();
            };
        };
    };

    // function noteLookUp() {
    //     let currentProject = ''
    //     for(const key in projectLibrary[selectedProject]){
    //         const titleDisplay = document.createElement('div');
    //         currentProject = selectedProject
    //         titleDisplay.classList.add('titleDisplay');
    //         titleDisplay.textContent = projectLibrary[selectedProject][key].title;
    //         noteInstance.appendChild(titleDisplay);
    //         createEdit(key, titleDisplay);
    //         createDelete(key, titleDisplay);
    //         };

    //     function createEdit(key, parent) {
    //         const editBtn = document.createElement('button');
    //         editBtn.addEventListener('click', editNote);
    //         editBtn.classList.add('editBtn');
    //         editBtn.textContent = 'Edit';
    //         parent.appendChild(editBtn);

    //         function editNote(){
    //             selectedProject = currentProject;
    //             selectedNote = key;
    //             editTitle.value = projectLibrary[selectedProject][selectedNote].title;
    //             editDescription.value = projectLibrary[selectedProject][selectedNote].description;
    //             editDueDate.value = projectLibrary[selectedProject][selectedNote].dueDate;
    //             editPriority.value = projectLibrary[selectedProject][selectedNote].priority;
    //             editDialog.open = true;

    //             if(selectedAll == 'no'){
    //                 editSubmitBtn.addEventListener('click', submitEdit);
    //                 function submitEdit(){
    //                     noteManipulator.editor(selectedProject, selectedNote, editTitle.value, editDescription.value, editDueDate.value, editPriority.value);
    //                     clearDisplay();
    //                     noteLookUp();
    //                     editSubmitBtn.removeEventListener('click', submitEdit);
    //                     // 
    //                     console.log(projectLibrary[selectedProject][selectedNote])
    //                 };
    //             } else {
    //                 editSubmitBtn.addEventListener('click', allEdit)
    //                 function allEdit(){
    //                     noteManipulator.editor(selectedProject, selectedNote, editTitle.value, editDescription.value, editDueDate.value, editPriority.value);
    //                     clearDisplay();
    //                     for(const key in projectLibrary){
    //                     selectedProject = key;
    //                     noteDisplay();
    //                     };
    //                     editSubmitBtn.removeEventListener('click', allEdit)
    //                     // 
    //                     console.log(projectLibrary[selectedProject][selectedNote])
    //                 };
    //             };
    //         };
    //     };

    //     function createDelete(key, parent) {
    //         const deleteBtn = document.createElement('button');
    //         deleteBtn.addEventListener('click', deleteNote);
    //         deleteBtn.classList.add('deleteBtn');
    //         deleteBtn.textContent = 'Delete';
    //         parent.appendChild(deleteBtn);

    //         function deleteNote(){
    //             selectedProject = currentProject;
    //             selectedNote = key;
    //             noteManipulator.noteDeleter(selectedProject, selectedNote);
    //             parent.remove();
    //         };
    //     };
    // };

return {clearDisplay, showNote, newNoteBtnAppend};
    
})();

export {DOMCreator}