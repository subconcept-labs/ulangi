import * as squel from 'squel'

declare module "squel" {
  interface Squel<S extends Select = Select,
    U extends Update = Update,
    D extends Delete = Delete,
    I extends Insert = Insert,
    C extends Case = Case> {

    insertOrReplace(options?: QueryBuilderOptions): I;
    insertOrIgnore(options?: QueryBuilderOptions): I;
  }
}

