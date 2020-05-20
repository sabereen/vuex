import Vue from 'vue'

declare global {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface VuexTS {}
}

export namespace Vuex {
  type Options<S> = {
    state: S;
    modules?: {
      [key: string]: Options<any>;
    };
    getters?: {
      [key: string]: (state: S) => any;
    };
    mutations?: {
      [key: string]: (state: S, payload: any) => void;
    };
    actions?: {
      [key: string]: (state: S, payload: any) => void;
    };
    strict?: boolean;
  }

  type Config = VuexTS extends Options<any> ? VuexTS : Options<any>

  type State = Config['state'] & {
    [K in keyof Config['modules']]: Config['modules'][K]['state'] extends (...args: any) => infer R ? R : Config['modules'][K]['state'];
  }

  type ModuleNames = keyof Config['modules']

  // type C<ModuleName extends keyof Config['modules']> = (Config['modules'][ModuleName] extends { getters: any } ? (a: Config['modules'][ModuleName]['getters']) => any : (a: {}) => any) extends (a: infer A) => any ? A : never
  type ModulePart<ModuleName extends keyof Config['modules'], Part extends keyof Config> = Config['modules'][ModuleName] extends { [K in Part]: any } ? Config['modules'][ModuleName][Part] : {};
  type ModulesPart<Part extends keyof Config, X extends ModuleNames = ModuleNames> = (X extends any ? (a: { [K in keyof ModulePart<X, Part>]: ModulePart<X, Part>[K] }) => void : never) extends (a: infer I) => void ? I : never

  type Getters = Config['getters'] & ModulesPart<'getters'>
  type Mutations = Config['mutations'] & ModulesPart<'mutations'>
  type Actions = Config['actions'] & ModulesPart<'actions'>

  interface StateMapper {
    [key: string]: (keyof State) | ((state: State) => unknown);
  }
  interface MapState {
    <K extends keyof State>(names: K[]): {
      [X in K]: () => State[X]
    };

    <O extends StateMapper>(config: O): {
      [K in keyof O]: () =>
        O[K] extends keyof State ? State[O[K]] :
        O[K] extends (...args: any) => any ? ReturnType<O[K]> : never
    };
  }

  interface GettersMapper {
    [key: string]: keyof Getters;
  }
  interface MapGetters {
    <K extends keyof Getters>(names: K[]): {
      [X in K]: () => ReturnType<Getters[X]>
    };

    <O extends GettersMapper>(config: O): {
      [K in keyof O]: () => ReturnType<Getters[O[K]]>
    };
  }

  interface MutationsMapper {
    [key: string]: keyof Mutations;
  }
  interface MapMutations {
    <K extends keyof Mutations>(names: K[]): {
      [X in K]: (payload: Parameters<Mutations[X]>[1]) => void
    };

    <O extends MutationsMapper>(config: O): {
      [K in keyof O]: (payload: Parameters<Mutations[O[K]]>[1]) => void
    };
  }

  interface ActionsMapper {
    [key: string]: keyof Actions;
  }
  interface MapActions {
    <K extends keyof Actions>(names: K[]): {
      [X in K]: (payload: Parameters<Actions[X]>[1]) => void
    };

    <O extends ActionsMapper>(config: O): {
      [K in keyof O]: (payload: Parameters<Actions[O[K]]>[1]) => void
    };
  }

  interface Store {
    state: Readonly<State>;
    getters: {
      readonly [K in keyof Getters]: ReturnType<Getters[K]>
    };
    commit<T extends keyof Mutations>(payload: Mutations[T] extends object ? ({ type: T } & Parameters<Mutations[T]>[1]) : never): void;
    commit<T extends keyof Mutations>(type: T, payload?: Parameters<Mutations[T]>[1]): void;
    dispatch<T extends keyof Actions>(payload: Actions[T] extends object ? ({ type: T } & Parameters<Actions[T]>[1]) : never): ReturnType<Actions[T]>;
    dispatch<T extends keyof Actions>(type: T, payload?: Parameters<Actions[T]>[1]): ReturnType<Actions[T]>;
  }


  // const store = originalStore as any as Store

  // export default store

}

export declare const mapState: Vuex.MapState
export declare const mapGetters: Vuex.MapGetters
export declare const mapMutations: Vuex.MapMutations
export declare const mapActions: Vuex.MapActions

export declare class Store<S, O extends Vuex.Options<S>> implements Vuex.Store {
  constructor(options: O);
  dispatch: Vuex.Store['dispatch'];
  commit: Vuex.Store['commit'];
  getters: Vuex.Store['getters'];
  state: Vuex.Store['state'];
}

export declare function install(): void;

declare module 'vue/types/vue' {
  interface Vue {
    $store: Vuex.Store;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: Vuex.Store;
  }
}
