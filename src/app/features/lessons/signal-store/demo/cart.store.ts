import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export const CartStore = signalStore(
  withEntities<CartItem>(), // → entities(), entityMap(), ids()
  withState({ coupon: '', discount: 0 }),
  withComputed(({ entities, discount }) => ({
    count: computed(() => entities().reduce((sum, i) => sum + i.qty, 0)),
    total: computed(() => entities().reduce((sum, i) => sum + i.qty * i.price, 0) * (1 - discount())),
  })),
  withMethods((store) => ({
    add(product: Omit<CartItem, 'qty'>) {
      const existing = store.entityMap()[product.id];
      patchState(
        store,
        existing
          ? updateEntity({ id: product.id, changes: { qty: existing.qty + 1 } })
          : addEntity({ ...product, qty: 1 }),
      );
    },
    remove(id: number) {
      patchState(store, removeEntity(id));
    },
    applyCoupon(code: string) {
      patchState(store, { coupon: code, discount: code === 'BIP10' ? 0.1 : 0 });
    },
  })),
  withHooks({
    onInit(store) {
      store.add({ id: 1, name: 'Áo mưa Bíp', price: 199000 });
    },
  }),
);
