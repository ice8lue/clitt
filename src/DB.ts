import * as LowDB from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import { v4 as uuid } from 'uuid';
import { filesystem } from 'gluegun';

const DB_FILE_PREFIX = `${filesystem.homedir()}/.clitt/`;

export interface Field {
  id: string;
  title: string;
  values?: string[];
}

type FieldValue = string | number | null;

interface Entry {
  id: string;
  start: number;
  data?: {
    [name: string]: FieldValue;
  };
  end?: number | null;
}

interface DBScheme {
  title: string;
  entries: Entry[];
  fields?: Field[];
}

class DB {
  private readonly adapter: typeof FileSync;
  private readonly db: LowDB.LowdbSync<DBScheme>;

  public constructor(readonly id = 'default') {
    // Make sure the ~/.clitt directory exists
    filesystem.dir(DB_FILE_PREFIX);
    const dbFilePath = filesystem.path(
      __dirname,
      `${DB_FILE_PREFIX}${id}.json`
    );

    this.adapter = new FileSync(dbFilePath);
    this.db = LowDB(this.adapter);

    if (!this.db.get('entries').value()) {
      this.db
        .defaults({
          title: id,
          entries: [],
          fields: [{ id: 'description', title: 'Description' }]
        })
        .write();
    }
  }

  public getFields(): Field[] {
    return this.db.get('fields').value() || [];
  }

  public getEntries(): Entry[] {
    return this.db.get('entries').value();
  }

  public getEntry(id: string): Entry | null {
    return this.db
      .get('entries')
      .find({ id })
      .value();
  }

  public getLastOpenEntry(): Entry | null {
    return this.db
      .get('entries')
      .find({ end: null })
      .value();
  }

  public createEntry(): Entry {
    this.db
      .get('entries')
      .push({
        id: uuid(),
        start: new Date().getTime(),
        end: null
      })
      .write();

    return this.getLastOpenEntry();
  }

  public updateEntry(id: string, entry: Entry): Entry | null {
    const { start, end, data } = entry;

    if (entry) {
      return this.db
        .get('entries')
        .find({ id })
        .assign({ start, end, data })
        .write();
    }

    return null;
  }
}

export default DB;
