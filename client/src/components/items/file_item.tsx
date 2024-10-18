import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ItemsProps {
    file: {
        name: string;
        type: string;
        id: number;
        locked?: boolean;
    };
    className: string;
    onLongPress: Function;
    isLongPressed: boolean;
    selectFile: Function;
    selected: boolean;
    setContextMenu: Function;
    isGroupItems?: boolean;
    groupSelectedItems?: Function;
    isDragging?: boolean;
}

function FileItem({ file, isDragging, groupSelectedItems, isGroupItems, className, onLongPress, isLongPressed, selectFile, selected, setContextMenu }: ItemsProps) {
    const navigate = useNavigate();
    const isFolder = file.type === "folder";
    const [isSelected, setIsSelected] = useState(selected == null ? false : selected);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    function toggleSelect() {
        const newSelected = !isSelected;
        setIsSelected(newSelected);
        selectFile(file, newSelected);
    }
    const icon = () => {
        if (file.type === "folder") {
            return file.locked ? "fa-regular fa-folder-closed" : "fas fa-folder";
        }
        switch (file.name.split('.').pop()) {
            case "js":
                return "fab fa-js-square";
            case "html":
                return "fab fa-html5";
            case "css":
                return "fab fa-css3-alt";
            case "json":
                return "fas fa-file-code";
            default:
                return "fas fa-file";
        }
    }
    async function browseFolder() {
        if (isGroupItems) {
            groupSelectedItems && groupSelectedItems(file.id);
            return;
        }
        if (isFolder && !file.locked) {
            // move to route /items/:parentId
            navigate(`/items/${file.id}`);
            // fetchFiles(file.id);
        }
    }
    const iconClass = icon() + ' ' + (isFolder ? 'has-text-info' : '');
    const longPressTimeout = useRef(null as any);
    let longPressTriggered = useRef(false);
    const handleMouseDown = (ev: any) => {
        longPressTimeout.current = setTimeout(() => {
            if (isDragging) return;
            longPressTriggered.current = true;
            onLongPress();
            toggleSelect();
        }, 500); // 500ms for long press
    };

    useEffect(() => {
        if (isSelected) {
            if (isDragging) {
                toggleSelect();
            }
        }

    }, [isDragging]);

    const isRightClicked = useRef(false);

    const handleContextMenu = (ev: any) => {
        ev.preventDefault();
        ev.stopPropagation();
        isRightClicked.current = true;
        setTimeout(() => {
            isRightClicked.current = false;
        }, 10);
        if (!isSelected) return;
        console.log("right click");
        setContextMenu({
            visible: true,
            x: ev.clientX,
            y: ev.clientY
        });
    };

    const handleMouseUp = (ev: any) => {
        clearTimeout(longPressTimeout.current);
        if (longPressTriggered.current) {
            longPressTriggered.current = false;
            return;
        }
        console.log("mouse up", isRightClicked.current);
        if (isRightClicked.current) return;
        isRightClicked.current = false;
        setContextMenu({
            visible: false,
        })
        if (ev.button === 2) return;
        if (isLongPressed) {
            // selectFile(file);
            toggleSelect();
        }
        else {
            browseFolder();
        }
    };

    const handleMouseLeave = () => {
        clearTimeout(longPressTimeout.current);
    };

    return <div ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onMouseLeave={handleMouseLeave} className={"box has-text-centered " + className + ' ' + (isFolder ? "is-clickable" : '') + ' ' + (isSelected ? 'file-selected' : '')}>
        <div className="is-size-1 has-text-centered">
            <i className={iconClass}></i>
        </div>
        {file.name}
    </div>;
}

export default FileItem;
