import { useState, useEffect, useCallback } from "react";
import Timer from "../add/tools/Timer";
import "../add/css/writing.css";
import task1DefaultImage from "../add/img/task1.png";
import task2DefaultImage from "../add/img/task2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

function Writing() {
    const [task1Image, setTask1Image] = useState<string | null>(localStorage.getItem("task1Image") || task1DefaultImage);
    const [task2Image, setTask2Image] = useState<string | null>(localStorage.getItem("task2Image") || task2DefaultImage);
    const [task1Text, setTask1Text] = useState<string>("");
    const [task2Text, setTask2Text] = useState<string>("");
    const [activeTab, setActiveTab] = useState<number>(1);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, image: string | null, setImage: React.Dispatch<React.SetStateAction<string | null>> } | null>(null);


    useEffect(() => {
        if (task1Image && task1Image !== task1DefaultImage) {
            localStorage.setItem("task1Image", task1Image);
        } else {
            localStorage.removeItem("task1Image");
        }
    }, [task1Image]);

    useEffect(() => {
        if (task2Image && task2Image !== task2DefaultImage) {
            localStorage.setItem("task2Image", task2Image);
        } else {
            localStorage.removeItem("task2Image");
        }
    }, [task2Image]);

    const handleClickOutside = useCallback(() => {
        setContextMenu(null);
    }, []);

    useEffect(() => {
        if (contextMenu && contextMenu.visible) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenu, handleClickOutside]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (setImage: React.Dispatch<React.SetStateAction<string | null>>, defaultImage: string) => {
        setImage(null);
        localStorage.removeItem(defaultImage === task1DefaultImage ? "task1Image" : "task2Image");
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, setText: React.Dispatch<React.SetStateAction<string>>) => {
        setText(e.target.value);
    };

    const wordCount = (text: string) => text.trim().split(/\s+/).length;

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, image: string | null, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true, image, setImage });
    };

    const handleReplaceImage = (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => handleImageUpload(e, setImage);
        input.click();
        setContextMenu(null);
    };

    const handleRemoveImage = (setImage: React.Dispatch<React.SetStateAction<string | null>>, defaultImage: string) => {
        removeImage(setImage, defaultImage);
        setContextMenu(null);
    };

    return (
        <div><Timer duration={3600} />
            <div className="writing-container">

            </div>
            <div className="tabs">
                <button className={activeTab === 1 ? "active" : ""} onClick={() => setActiveTab(1)}>1️⃣ Task 1</button>
                <button className={activeTab === 2 ? "active" : ""} onClick={() => setActiveTab(2)}>2️⃣ Task 2</button>
            </div>
            {activeTab === 1 && (
                <div className="task">
                    <div className="word-count">Word count: {wordCount(task1Text)}</div>
                    <div className="writing-content">
                        <div className="task-image" onContextMenu={(e) => handleContextMenu(e, task1Image, setTask1Image)}>
                            {task1Image ? (
                                <>
                                    <img src={task1Image} alt="Task 1" className="fit-image" />
                                    <button className="replace-button" onClick={() => handleReplaceImage(setTask1Image)}>
                                        <FontAwesomeIcon icon={faSyncAlt} />
                                    </button>
                                    <button className="remove-button" onClick={() => removeImage(setTask1Image, task1DefaultImage)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </>
                            ) : (
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setTask1Image)} />
                            )}
                        </div>
                        <div className="textarea-container">
                            <textarea
                                placeholder="Start typing your answer for Task 1 here..."
                                value={task1Text}
                                onChange={(e) => handleTextChange(e, setTask1Text)}
                            ></textarea>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 2 && (
                <div className="task">
                    <div className="word-count">Word count: {wordCount(task2Text)}</div>
                    <div className="writing-content">
                        <div className="task-image" onContextMenu={(e) => handleContextMenu(e, task2Image, setTask2Image)}>
                            {task2Image ? (
                                <>
                                    <img src={task2Image} alt="Task 2" className="fit-image" />
                                    <button className="replace-button" onClick={() => handleReplaceImage(setTask2Image)}>
                                        <FontAwesomeIcon icon={faSyncAlt} />
                                    </button>
                                    <button className="remove-button" onClick={() => removeImage(setTask2Image, task2DefaultImage)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </>
                            ) : (
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setTask2Image)} />
                            )}
                        </div>
                        <div className="textarea-container">
                            <textarea
                                placeholder="Start typing your answer for Task 2 here..."
                                value={task2Text}
                                onChange={(e) => handleTextChange(e, setTask2Text)}
                            ></textarea>
                        </div>
                    </div>
                </div>
            )}
            {contextMenu && contextMenu.visible && (
                <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button onClick={() => handleReplaceImage(contextMenu.setImage)}>Replace Image</button>
                    <button onClick={() => handleRemoveImage(contextMenu.setImage, contextMenu.image === task1DefaultImage ? task1DefaultImage : task2DefaultImage)}>Remove Image</button>
                </div>
            )}
        </div>
    );
}

export default Writing;
