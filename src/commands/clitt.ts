import { Field } from './../DB';
import { GluegunToolbox } from 'gluegun';
import DB from '../DB';

interface BasicAsk {
  name: string;
  message: string;
}

interface InputAsk extends BasicAsk {
  type: 'input';
}

interface SelectAsk extends BasicAsk {
  type: 'select';
  choices: string[];
}

module.exports = {
  name: 'clitt',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters } = toolbox;

    const options = parameters && parameters.options || {};
    const project = options.project || options.p || 'default';

    const db = new DB(project);
    const lastEntry = db.getLastOpenEntry();

    if (lastEntry) {
        const questions = db.getFields().map((field: Field): InputAsk | SelectAsk => {         
          let ask = {
            name: field.id,
            message: field.title
          };

          if (field.values) {
            return {
              ...ask,
              type: 'select',
              choices: [...field.values]
            };
          }          
          
          return {
            ...ask,
            type: 'input'
          };
        });
        
        const data = questions.length ? await toolbox.prompt.ask(questions) : null;

        db.updateEntry(lastEntry.id, {
            ...lastEntry,
            end: new Date().getTime(),
            data: data
        });

        print.success('Finished last entry.');
    } else {
        db.createEntry();
        print.success('Created new entry.');
    }
  },
}
