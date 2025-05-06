import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for a todo item
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// Define the type for our store
interface TodoStore {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    removeTodo: (id: number) => void;
    clearCompleted: () => void;
}

// Create the store with TypeScript types
const useTodoStore = create<TodoStore>()(
    persist(
        (set) => ({
            // State
            todos: [],

            // Actions
            addTodo: (text) => {
                console.log('Adding todo:', text); // Debug log
                set((state) => {
                    const newState = {
                        todos: [...state.todos, { id: Date.now(), text, completed: false }]
                    };
                    console.log('New state:', newState); // Debug log
                    return newState;
                });
            },

            toggleTodo: (id) => set((state) => ({
                todos: state.todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
            })),

            removeTodo: (id) => set((state) => ({
                todos: state.todos.filter(todo => todo.id !== id)
            })),

            clearCompleted: () => set((state) => ({
                todos: state.todos.filter(todo => !todo.completed)
            }))
        }),
        {
            name: 'todo-storage', // Name of the item in localStorage
            version: 1, // Current version
            migrate: (persistedState) => {
                // If we need to update the structure in the future,
                // we can write migration logic here
                return persistedState as TodoStore;
            },
        }
    )
);

export default useTodoStore;