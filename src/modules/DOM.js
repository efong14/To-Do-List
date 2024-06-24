import {  projectBuilder, projectLibrary, projectDeleter, noteBuilder, noteManipulator,} from "./objectBuilder";
import { isToday, isThisWeek } from 'date-fns';
import editIcon from '../Icons/edit.svg';
import deleteIcon from '../Icons/delete.svg';

const newProjectBtn = document.getElementById('newProject');
const projectHeader = document.getElementById('projectHeader');
const projectName = document.getElementById('projectName');
const projectDialog = document.getElementById('projectDialog');
const projectForm = document.getElementById('projectForm');
const projectSubmitBtn = document.getElementById('projectSubmit');

const noteContainer = document.getElementById('noteContainer');
const noteInstance = document.getElementById('noteInstance')
const noteDialog = document.getElementById('noteDialog');
const noteForm = document.getElementById('noteForm')
const noteTitle = document.getElementById('noteTitle');
const noteDescription = document.getElementById('noteDescription');
const noteDueDate = document.getElementById('noteDueDate');
const noteSubmitBtn = document.getElementById('noteSubmit');

const editDialog = document.getElementById('editDialog');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editDueDate = document.getElementById('editDueDate');
const editSubmitBtn = document.getElementById('editSubmit');

const allBtn = document.getElementById('all');
const todayBtn = document.getElementById('today');
const thisWeekBtn = document.getElementById('thisWeek');
const completedBtn = document.getElementById('completed')
const cancelBtn = document.querySelectorAll('#cancel');

let selectedProject = ''
let selectedNote = ''

const noteCreator = (function () {
    const newNoteBtn = document.createElement('button');
    newNoteBtn.classList.add('newNoteBtn');
    noteSubmitBtn.addEventListener('click', buildNote);


    function clearDisplay(){
        noteInstance.innerHTML = '';
        newNoteBtn.remove();
    };

    const newNoteBtnAppend = () => {
        newNoteBtn.textContent = '+';
        newNoteBtn.addEventListener('click', openNoteDialog);
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
        if(projectLibrary[selectedProject][noteTitle.value]){
            alert('Cannot repeat title, please choose another title.');
            return;
        };
        const note = noteBuilder(noteTitle.value, noteDescription.value, noteDueDate.value, document.querySelector('input[name = priority]:checked').value);
        selectedNote = noteTitle.value;
        note.noteAdder(selectedProject);
        showNote(noteTitle.value);
    };

    const showNote = (note) => {
        let currentProject = selectedProject;
        let currentNote = selectedNote;

        const noteEntry = document.createElement('div');
        const titleContainer = document.createElement('div');
        const buttonContainer = document.createElement('div');
        noteEntry.classList.add('noteEntry');
        titleContainer.classList.add('titleContainer');
        buttonContainer.classList.add('buttonContainer');
        noteInstance.appendChild(noteEntry);
        noteEntry.appendChild(titleContainer);
        noteEntry.appendChild(buttonContainer);
        

        const doneBox = document.createElement('input');
        doneBox.setAttribute('type', 'checkbox');
        doneBox.setAttribute('value', 'done');
        doneBox.setAttribute('class', 'doneBox');
        doneBox.addEventListener('change', changed);
        titleContainer.appendChild(doneBox);
        if(projectLibrary[selectedProject][selectedNote].completion == 'Done') doneBox.checked = true;
        function changed() {
            selectedProject = currentProject;
            selectedNote = currentNote;
            if(doneBox.checked == true) {
                projectLibrary[selectedProject][selectedNote].completion = 'Done';
                titleDisplay.setAttribute('completion', 'Done');
            }else {
                projectLibrary[selectedProject][selectedNote].completion = 'Not done';
                titleDisplay.setAttribute('completion', 'Not Done');
            };
            localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
        };

        const titleDisplay = document.createElement('div');
        titleDisplay.classList.add('titleDisplay');
        titleDisplay.setAttribute('id', `${selectedNote}`);
        titleDisplay.setAttribute('completion', `${projectLibrary[selectedProject][selectedNote].completion}`);
        noteEntry.setAttribute('cssPriority', `${projectLibrary[selectedProject][selectedNote].priority}`);
        titleDisplay.setAttribute('priority', `${projectLibrary[selectedProject][selectedNote].priority}`);
        titleDisplay.textContent = projectLibrary[selectedProject][note].title;
        titleContainer.appendChild(titleDisplay);

        const editBtn = document.createElement('button');
        let editImg = new Image();
        editImg.src = editIcon;
        editBtn.classList.add('editBtn');
        buttonContainer.appendChild(editBtn);
        editBtn.appendChild(editImg)
        editBtn.addEventListener('click', editNote);
        editSubmitBtn.addEventListener('click', submitEdit);
        function editNote(){
            selectedProject = currentProject;
            selectedNote = currentNote;
            editTitle.value = projectLibrary[selectedProject][selectedNote].title;
            editDescription.value = projectLibrary[selectedProject][selectedNote].description;
            editDueDate.value = projectLibrary[selectedProject][selectedNote].dueDate;
            if(projectLibrary[selectedProject][selectedNote].priority == 'high'){
                document.getElementById('editHigh').checked = true;
            } else {
                document.getElementById('editNormal').checked = true;
            }
            editDialog.open = true;
            };
        function submitEdit(){
            if(editTitle.value == '') {
                alert('Please input a title');
                return;
            };
            noteManipulator.editor(selectedProject, selectedNote, editTitle.value, editDescription.value, editDueDate.value, document.querySelector('input[name = editPriority]:checked').value);
            document.getElementById(`${selectedNote}`).textContent = editTitle.value;
            titleDisplay.setAttribute('priority', `${projectLibrary[selectedProject][selectedNote].priority}`);
            noteEntry.setAttribute('cssPriority', `${projectLibrary[selectedProject][selectedNote].priority}`);
        };

        const deleteBtn = document.createElement('button');
        let deleteImg = new Image();
        deleteImg.src = deleteIcon;
        deleteBtn.addEventListener('click', deleteNote);
        deleteBtn.classList.add('deleteBtn');
        buttonContainer.appendChild(deleteBtn);
        deleteBtn.appendChild(deleteImg)
        function deleteNote(){
            selectedProject = currentProject;
            selectedNote = currentNote;
            noteManipulator.noteDeleter(selectedProject, selectedNote);
            noteEntry.remove();
        };
    };

return {clearDisplay, showNote, newNoteBtnAppend};
    
})();

const DOMManipulator = (function() {

    let projectStorage = JSON.parse(localStorage.getItem('projectLibraryStorage'));
    console.log(projectStorage)

    if(Object.keys(projectStorage).length !== 0){
        projectLibrary = projectStorage;
        for(const project in projectLibrary){
            const projectBtnContainer = document.createElement('div');
            projectBtnContainer.classList.add('projectContainer');
            projectHeader.insertBefore(projectBtnContainer, newProjectBtn);
            appendProjectBtn(project, projectBtnContainer);
            appendProjectDelete(project, projectBtnContainer);
        };
        displayAll();
    } else {
        console.log('Nothing!')
    }

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
        if(projectLibrary[projectName.value]) {
            alert('Cannot repeat project name, please choose another name.');
            return;
        };

        const projectBtnContainer = document.createElement('div');
        projectBtnContainer.classList.add('projectContainer');
        projectHeader.insertBefore(projectBtnContainer, newProjectBtn);
        projectBuilder(projectName.value); 
        appendProjectBtn(projectName.value, projectBtnContainer);
        appendProjectDelete(projectName.value, projectBtnContainer);
    };

    function appendProjectDelete(name, parent){
        const projectDeleteBtn= document.createElement('button');
        projectDeleteBtn.textContent = 'X';
        projectDeleteBtn.classList.add('projectDeleteBtn')
        projectDeleteBtn.addEventListener('click', deleteProject);
        parent.appendChild(projectDeleteBtn)

        function deleteProject() {
            projectDeleter(name);
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

export {DOMManipulator}