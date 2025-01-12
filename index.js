function createStore(reducer, initialState) {
  const _store = { state: { ...initialState } };
  const _listners = [];
  return {
    subscribe: (listner) => {
      if (!listner) {
        throw new Error("Invalid listner");
      }
      if (!_listners.find((l) => l === listner)) {
        _listners.push(listner);
      }
      return () => {
        _listners.splice(_listners.indexOf(listner), 1);
      };
    },
    dispatch: (action) => {
      _store.state = reducer(_store.state, action);
      _listners.forEach((l) => {
        l(_store.state);
      });
    },
    getState: () => _store.state,
  };
}

//Create  and return new state. Pure Functions
function reducer(state, action) {
  if (action.type === "UPDATE_NAME") {
    return { ...state, name: action.name };
  }
}

const initialState = { name: "test" };

const store = createStore(reducer, initialState);

const unsubscribe = store.subscribe((state) => {
  console.log("update state: ", state.name);
});

store.dispatch({ type: "UPDATE_NAME", name: "Alice" });
store.dispatch({ type: "UPDATE_NAME", name: "Bob" });
unsubscribe();
store.dispatch({ type: "UPDATE_NAME", name: "Carl" });
console.log(`final state: ${store.getState().name}`);
