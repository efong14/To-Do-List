const projectLibrary = {}

function projectBuilder(name) {
    projectLibrary[name] = {};
}

function noteBuilder (noteTitle, noteDescription, noteDueDate, notePriority) {
    const note = {
        title: noteTitle,
        description: noteDescription,
        dueDate: noteDueDate,
        priority: notePriority
    };

    const noteAdder = (name) =>{
        projectLibrary[name][noteTitle] = note
    };

    return {noteAdder}
};

export {projectLibrary, projectBuilder, noteBuilder}