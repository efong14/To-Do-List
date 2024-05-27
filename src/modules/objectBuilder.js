const projectLibrary = {}

function projectBuilder(name) {
    projectLibrary[name] = {};

    const projectDeleter = () => {
        delete projectLibrary[name];
    };

    return {projectDeleter} 
}

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

    const noteDeleter = (name) => {
        delete projectLibrary[name][noteTitle];
    };

    return {noteAdder, noteDeleter};
};

// Sample 

// projectBuilder('project1');
// const note1 = noteBuilder('Run','Run 5 miles','Tomorrow','1');
// note1.noteAdder('project1')

export {projectLibrary, projectBuilder, noteBuilder}