class Note {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    sayHi() {
        console.log(this.title)
    }
};

export {Note}