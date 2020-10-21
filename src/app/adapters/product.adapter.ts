import { EntityState, createEntityAdapter }     from '@ngrx/entity';
import { Product }                                from '../Model/product.model';

// Entity adapter
export const ProductAdapter = createEntityAdapter<Product>({
    selectId: (product: Product) => product.Id,
    sortComparer: false
});

export interface State extends EntityState<Product> {}

export const InitialState: State = ProductAdapter.getInitialState();