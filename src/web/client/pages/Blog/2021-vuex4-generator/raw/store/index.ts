import { InjectionKey } from 'vue'
import { CommitOptions, createStore, DispatchOptions, Store, useStore } from 'vuex'
import { mutations, ExampleMutations } from './mutations'
import { actions, ExampleActions } from './actions'
import { getters, ExampleGetters } from './getters'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export interface ExampleState {
    count: number
}

export function createDefaultExampleState(): ExampleState {
    const defaultState: ExampleState = {
        count: 0,
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// TypeScript Helpers
// ----------------------------------------------------------------------------

type TypedStore = Omit<Store<ExampleState>, 'commit' | 'dispatch' | 'getters'> & {
    commit<K extends keyof ExampleMutations>(
        key: K,
        payload?: Parameters<ExampleMutations[K]>[1],
        options?: CommitOptions
    ): ReturnType<ExampleMutations[K]>
} & {
    dispatch<K extends keyof ExampleActions>(
        key: K,
        payload?: Parameters<ExampleActions[K]>[1],
        options?: DispatchOptions
    ): ReturnType<ExampleActions[K]>
} & {
    getters: {
        [K in keyof ExampleGetters]: ReturnType<ExampleGetters[K]>
    }
}

export const injectionKeyExample: InjectionKey<TypedStore> = Symbol('Vuex (Example) InjectionKey')

export function useExampleStore(): TypedStore {
    return useStore(injectionKeyExample)
}

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export function createExampleStore(): TypedStore {
    const store = createStore<ExampleState>({
        strict: true,
        state: createDefaultExampleState,
        mutations,
        actions,
        getters,
    }) as TypedStore

    return store
}
