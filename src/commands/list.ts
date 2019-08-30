import DB, { Entry, Field } from './../DB';
import { GluegunToolbox } from 'gluegun';
import {table} from 'table';

module.exports = {
  name: 'clitt',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print } = toolbox;

    const options = parameters && parameters.options || {};
    const project = options.project || options.p || 'default';

    const db = new DB(project);
    const fields = db.getFields();
    const entries = db.getEntries();

    const config = {
      columns: new Array(2 + fields.length).fill({
        alignment: 'center'
      })
    };

    const data = [
      [
        'Start', 
        'End'
      ].concat((fields || []).map((field: Field) => {
        return field.title
      }))
    ];

    const formattedEntries = entries.map((entry: Entry) => {
      const row = [
        new Date(entry.start).toLocaleString(),
        entry.end ? new Date(entry.end).toLocaleString() : 'running'
      ];

      if (entry.data) {
        Object.keys(entry.data).forEach((key: string) => {
          row.push(entry.data[key] as string);
        })
      }

      return row;
    });

    print.info( table(data.concat(formattedEntries), config))
  },
}
