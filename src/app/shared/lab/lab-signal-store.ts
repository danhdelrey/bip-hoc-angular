import * as s from '@ngrx/signals';
import * as e from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

/** Globals cho bài luyện SignalStore: @ngrx/signals, entities và rxMethod. */
export function signalStoreExtras(): Record<string, unknown> {
  return {
    signalStore: s.signalStore, signalState: s.signalState, signalStoreFeature: s.signalStoreFeature,
    withState: s.withState, withComputed: s.withComputed, withMethods: s.withMethods, withHooks: s.withHooks,
    withProps: s.withProps, withLinkedState: s.withLinkedState, patchState: s.patchState, getState: s.getState,
    watchState: s.watchState, type: s.type,
    withEntities: e.withEntities, addEntity: e.addEntity, addEntities: e.addEntities, setEntity: e.setEntity,
    setAllEntities: e.setAllEntities, updateEntity: e.updateEntity, removeEntity: e.removeEntity, upsertEntity: e.upsertEntity,
    entityConfig: e.entityConfig,
    rxMethod,
  };
}
