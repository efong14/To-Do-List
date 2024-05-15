import './style.css'
import { Project, projectLibrary } from './modules/projectBuilder';
import { Note } from './modules/noteBuilder';


new Project('Project1')
projectLibrary.Project1.note1 = new Note ('Run','Run 5 miles','Tomorrow','1');
new Project('Project2')

console.log(projectLibrary.Project1)


// noteLibrary.push(new Note ('Run','Run 5 miles','Tomorrow','1'));

