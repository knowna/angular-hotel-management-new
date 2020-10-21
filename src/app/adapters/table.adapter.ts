import { EntityState, createEntityAdapter }     from '@ngrx/entity';
import { Table }                                from '../Model/table.model';

// Entity adapter
export const TableAdapter = createEntityAdapter<Table>({
    selectId: (table: Table) => table.TableId,
    sortComparer: false
});

export interface State extends EntityState<Table> {
    CurrentTableId?: string
}

export const InitialState: State = TableAdapter.getInitialState({
    CurrentTableId: ""
});