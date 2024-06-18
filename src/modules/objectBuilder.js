let projectLibrary = {};

function projectBuilder(name) {
    projectLibrary[name] = {};
    localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
};

function projectDeleter(name){
        delete projectLibrary[name];
        localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
};

function noteBuilder (noteTitle, noteDescription, noteDueDate, notePriority) {
    const note = {
        title: noteTitle,
        description: noteDescription,
        dueDate: noteDueDate,
        priority: notePriority,
        completion: 'Not done'
    };

    const noteAdder = (name) => {
        projectLibrary[name][noteTitle] = note;
        localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
    };

    return {noteAdder}
};

const noteManipulator = (function() {

    const noteDeleter = (selectedProject, noteTitle) => {
        delete projectLibrary[selectedProject][noteTitle];
        localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
    };

    const editor = (selectedProject, noteTitle, editedTitle, editedDescription, editedDueDate, editedPriority) => {
        projectLibrary[selectedProject][noteTitle].title = editedTitle;
        projectLibrary[selectedProject][noteTitle].description = editedDescription;
        projectLibrary[selectedProject][noteTitle].dueDate = editedDueDate;
        projectLibrary[selectedProject][noteTitle].priority = editedPriority;
        localStorage.setItem('projectLibraryStorage', JSON.stringify(projectLibrary));
    };

    return{noteDeleter, editor};
})();

// Sample 

// projectBuilder('project1');
// const note1 = noteBuilder('Run','Run 5 miles','Tomorrow','1');
// note1.noteAdder('project1')

export {projectLibrary, projectBuilder, projectDeleter,  noteBuilder, noteManipulator}