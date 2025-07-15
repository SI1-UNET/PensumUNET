import {atom} from 'nanostores';
import type { IMateriasObject } from '../schemas/materias';


export const materiasDataStore = atom<IMateriasObject>({});

export function clearRouteDataStore() {
  materiasDataStore.set({});
}

