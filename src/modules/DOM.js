import { noteBuilder, noteManipulator, projectBuilder, projectLibrary } from "./objectBuilder";
import { isToday, isThisWeek } from 'date-fns'

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

const allBtn = document.getElementById('all');
const todayBtn = document.getElementById('today');
const thisWeekBtn = document.getElementById('thisWeek');
const completedBtn = document.getElementById('completed')
const cancelBtn = document.querySelectorAll('#cancel');

let selectedProject = ''
let selectedNote = ''

const DOMCreator = (function() {
    newProjectBtn.addEventListener('click', openProjectDialog);
    projectSubmitBtn.addEventListener('click', buildProject);
    allBtn.addEventListener('click', displayAll);
    todayBtn.addEventListener('click', displayToday);
    thisWeekBtn.addEventListener('click', displayThisWeek);
    completedBtn.addEventListener('click', displayCompleted);
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
            selectedProject = name;
            noteCreator.clearDisplay();
            noteCreator.newNoteBtnAppend();
            for(const note in projectLibrary[name]){
                selectedNote = note
                noteCreator.showNote(note);
            };
        };
    };

    function displayAll(){
        noteCreator.clearDisplay();
        for(const project in projectLibrary){
            selectedProject = project;
            for(const note in projectLibrary[project]){
                selectedNote = note;
                noteCreator.showNote(note);
            };
        };
    };

    function displayToday(){
        noteCreator.clearDisplay();
        for(const project in projectLibrary){
            selectedProject = project;
            for(const note in projectLibrary[project]){
                if(isToday(new Date(projectLibrary[project][note].dueDate)) == true){
                    selectedNote = note;
                    noteCreator.showNote(note);
                };
            };
        };
    };

    function displayThisWeek(){
        noteCreator.clearDisplay();
        for(const project in projectLibrary){
            selectedProject = project;
            for(const note in projectLibrary[project]){
                if(isThisWeek(new Date(projectLibrary[project][note].dueDate)) == true){
                    selectedNote = note;
                    noteCreator.showNote(note);
                };
            };
        };
    }

    function displayCompleted(){
        noteCreator.clearDisplay();
        for(const project in projectLibrary){
            selectedProject = project;
            for(const note in projectLibrary[project]){
                if(projectLibrary[project][note].completion == 'Done'){
                    selectedNote = note;
                    noteCreator.showNote(note);
                };
            };
        };
    }
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

        const doneBox = document.createElement('input');
        doneBox.setAttribute('type', 'checkbox');
        doneBox.setAttribute('value', 'done');
        doneBox.addEventListener('change', changed);
        titleContainer.appendChild(doneBox);
        if(projectLibrary[selectedProject][selectedNote].completion == 'Done') doneBox.checked = true;
        function changed() {
            selectedProject = currentProject;
            selectedNote = currentNote;
            if(doneBox.checked == true) {
                projectLibrary[selectedProject][selectedNote].completion = 'Done';
            }else {
                projectLibrary[selectedProject][selectedNote].completion = 'Not done';
            };
        };

        const titleDisplay = document.createElement('div');
        titleDisplay.classList.add('titleDisplay');
        titleDisplay.setAttribute('id', `${selectedNote}`);
        titleDisplay.textContent = projectLibrary[selectedProject][note].title;
        titleContainer.appendChild(titleDisplay);

        const editBtn = document.createElement('button');
        editBtn.classList.add('editBtn');
        editBtn.textContent = 'Edit';
        titleContainer.appendChild(editBtn);
        editBtn.addEventListener('click', editNote);
        editSubmitBtn.addEventListener('click', submitEdit);
        function editNote(){
            selectedProject = currentProject;
            selectedNote = currentNote;
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

        const deleteBtn = document.createElement('button');
        deleteBtn.addEventListener('click', deleteNote);
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.textContent = 'Delete';
        titleContainer.appendChild(deleteBtn);
        function deleteNote(){
            selectedProject = currentProject;
            selectedNote = currentNote;
            noteManipulator.noteDeleter(selectedProject, selectedNote);
            titleContainer.remove();
        };
    };

return {clearDisplay, showNote, newNoteBtnAppend};
    
})();

export {DOMCreator}