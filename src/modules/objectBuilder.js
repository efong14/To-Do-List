const projectLibrary = {};

function projectBuilder(name) {
    if(Object.hasOwn(projectLibrary, name) == true) return;
    projectLibrary[name] = {};

    const projectDeleter = () => {
        delete projectLibrary[name];
    };

    return {projectDeleter} 
};

function noteBuilder (noteTitle, noteDescription, noteDueDate, notePriority) {
    const note = {
        title: noteTitle,
        description: noteDescription,
        dueDate: noteDueDate,
        priority: notePriority
    };

    const noteAdder = (name) => {
        projectLibrary[name][noteTitle] = note
    };

    return {noteAdder}
};

const noteManipulator = (function() {

    const noteDeleter = (selectedProject, noteTitle) => {
        delete projectLibrary[selectedProject][noteTitle];
    };

    const editor = (selectedProject, noteTitle, editedTitle, editedDescription, editedDueDate, editedPriority) => {
        projectLibrary[selectedProject][noteTitle].title = editedTitle;
        projectLibrary[selectedProject][noteTitle].description = editedDescription;
        projectLibrary[selectedProject][noteTitle].dueDate = editedDueDate;
        projectLibrary[selectedProject][noteTitle].priority = editedPriority;
    };

    return{noteDeleter, editor};
})();

// Sample 

// projectBuilder('project1');
// const note1 = noteBuilder('Run','Run 5 miles','Tomorrow','1');
// note1.noteAdder('project1')

export {projectLibrary, projectBuilder, noteBuilder, noteManipulator}