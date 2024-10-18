import { STORE } from "../store";

export default function Counter() {
    const { count, increment, decrement } = STORE.count();
    return (
        <div>
            <h1>Counter</h1>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}
