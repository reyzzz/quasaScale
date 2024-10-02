import Dexie, { Table } from 'dexie'
import { QuasascaleInstance } from 'src/types/Database'

class myLocalDatabase extends Dexie {
  headscale_instances!: Table<QuasascaleInstance>
  constructor() {
    super('quasascale_db')
    this.version(1).stores({
      headscale_instances:
        '++id, name,quasascale_backend_url, headscale_api_key, active',
    })
  }
}
export const db = new myLocalDatabase()
