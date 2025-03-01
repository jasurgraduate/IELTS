import { useState, useEffect, useRef } from 'react';
import '../add/css/to-do-list.css';
import useHistory from './ToDoList/UseHistory';

interface ToDoItem {
    text: string;
    completed: boolean;
}

function ToDoList() {
    const savedItems = localStorage.getItem('items');
    const initialItems: ToDoItem[] = savedItems ? JSON.parse(savedItems) : [];
    const {
        state: items,
        set: setItems,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useHistory<ToDoItem[]>(initialItems);

    const [input, setInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const addItem = () => {
        if (input.trim()) {
            if (isEditing && currentIndex !== null) {
                const newItems = [...items];
                newItems[currentIndex] = { ...newItems[currentIndex], text: input };
                setItems(newItems);
                setIsEditing(false);
                setCurrentIndex(null);
            } else {
                setItems([...items, { text: input, completed: false }]);
            }
            setInput('');
        }
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const editItem = (index: number) => {
        setInput(items[index].text);
        setIsEditing(true);
        setCurrentIndex(index);
    };

    const toggleComplete = (index: number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], completed: !newItems[index].completed };
        setItems(newItems);
    };

    const clearAllItems = () => {
        setItems([]);
    };

    return (
        <>
            <div className="to-do-list-app">
                <h1 className="to-do-list-title">To-Do List</h1>
                <div className="to-do-list-input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add an item"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addItem();
                            }
                        }}
                        ref={inputRef}
                    />
                    <button className="to-do-list-button" onClick={addItem}>{isEditing ? '✅ Update' : '➕'}</button>
                </div>
                <div className="to-do-list-history-controls">
                    <button className="to-do-list-undo-button to-do-list-button" onClick={undo} disabled={!canUndo} title="Undo">
                        ↩
                    </button>
                    <button className="to-do-list-redo-button to-do-list-button" onClick={redo} disabled={!canRedo} title="Redo">
                        ↪
                    </button>
                    <button className="to-do-list-trash-button to-do-list-button" onClick={clearAllItems} title="Clear All">
                        ✘
                    </button>
                </div>
                <ul className="to-do-list-items">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`to-do-list-item ${item.completed ? 'to-do-list-completed' : ''}`}
                            onClick={() => toggleComplete(index)}
                        >
                            <span className={item.completed ? 'to-do-list-completed-text' : ''}>{item.text}</span>
                            <div className="to-do-list-checkbox-container">
                                <input
                                    type="checkbox"
                                    className="to-do-list-checkbox"
                                    checked={item.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleComplete(index);
                                    }}
                                />
                                <div>
                                    <button
                                        className="to-do-list-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            editItem(index);
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="to-do-list-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(index);
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ToDoList;
