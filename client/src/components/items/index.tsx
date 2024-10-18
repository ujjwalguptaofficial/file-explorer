import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { STORE } from "../../store";
import Menu from "./menu";
import FileItem from "./file_item";
import GroupIntoFolder from "./group_into_folder";
import { service } from "../../services";
import { useEffect, useMemo, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

function Items() {
    const { files, set, setParentId } = STORE.file();
    const location = useLocation();
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [selected, setSelected] = useState({} as any);
    const [isGroupItems, setIsGroupItems] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [itemsToMove, setItemsToMove] = useState<string[]>([]);
    const [isLongPressed, setIsLongPressed] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

    async function fetchFiles(parentId: number) {
        setIsFetching(true);
        console.log('fetching files', parentId);
        setParentId(parentId);
        const filesFromAPI = await service.file.getFiles(parentId);
        set(filesFromAPI);
        setIsFetching(false);
    }
    function loadFiles() {
        const id = folderId ? parseInt(folderId, 10) : 0;
        fetchFiles(id);
    }
    useEffect(() => {
        console.log("useAffect")
        loadFiles();
        connectWebSocket();
        // return () => {
        //     console.log("socket disconnected");
        //     socket.disconnect();
        // }
    }, [location]);
    let component;
    
    function onLongPress() {
        setIsLongPressed(true);
    }

    const isFolderOnlySelected = useMemo(() => {
        const keys = Object.keys(selected);
        if (keys.length > 1) return false;
        return keys.every((key: any) => {
            return files.find((file) => file.id == key)?.type === 'folder';
        });
    }, [selected]);

    function selectFile(file: any, status: boolean) {
        // (file as any)['selected'] = (file as any)['selected'] == null ? true : !(file as any)['selected'];
        // console.log("file", file);
        if (status === false) {
            delete selected[file.id];
        }
        else {
            selected[file.id] = status;
        }
        setSelected({ ...selected });
        console.log("selected", selected);
        if (Object.keys(selected).length === 0) {
            setIsLongPressed(false);
        }
    }

    function groupIntoFolder() {
        setContextMenu({ visible: false, x: 0, y: 0 });
        setIsGroupItems(true);
    }

    function groupItems(folderId: number) {
        setIsGroupItems(false);
        const selectedFilesId = Object.keys(selected);
        console.log('selectedFiles', selectedFilesId, folderId);
        service.file.groupItems({ parentId: folderId, fileIds: selectedFilesId }).then(() => {
            // loadFiles();
            setIsLongPressed(false);
            setSelected({});
            navigate('.', { replace: true }); // Reload the component
            setTimeout(() => {
                alert('grouped successfully');
            }, 0);
        });
    }

    function onGroupItemsCancel() {
        setIsGroupItems(false);
        setIsLongPressed(false);
        setSelected({});
        onDragMove();
    }

    function handleDragEnd(event: any) {
        // console.log('drag end', event);
        const { active, over } = event;
        if (active.id !== over.id) {
            const items = files;
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            // console.log('New ordered items:', newItems);
            const swappedEls: any[] = [];
            newItems.forEach((newItem, index) => {
                if (newItem.id !== items[index].id) {
                    swappedEls.push({
                        id: newItem.id,
                        order: index + 1
                    })
                }
            });
            console.log('Swapped elements:', swappedEls);
            service.file.reorderItems(swappedEls, service.socket.id).then(() => {
                setIsDragging(false);
            });
            set(newItems);
            // return newItems;
        }
    }

    function onDragStart() {
        console.log('drag start');
    }

    const dragMoveTimeout = useRef(null as any);

    function onDragMove() {
        console.log('drag move');
        setIsDragging(true);
        setIsLongPressed(false);
        clearTimeout(dragMoveTimeout.current);
        dragMoveTimeout.current = setTimeout(() => {
            setIsDragging(false);
            if (Object.keys(selected).length > 0) {
                setIsLongPressed(true);
            }
        }, 10);
    }

    function onDragCancel() {
        console.log('drag cancel');
        setIsDragging(false);
    }

    function onBodyContextMenu(ev: any) {
        if (itemsToMove.length > 0) {
            ev.preventDefault();
            setContextMenu({
                visible: true,
                x: ev.clientX,
                y: ev.clientY
            });
        }
    }


    function moveItems() {
        setItemsToMove(Object.keys(selected));
        setIsDragging(true);
        setTimeout(() => {
            setIsDragging(false);
        }, 0);
        setContextMenu({ visible: false, x: 0, y: 0 });
    }

    function moveHere() {
        service.file.moveItems({
            fileIds: itemsToMove,
            parentId: folderId
        }).then(() => {
            setContextMenu({ visible: false, x: 0, y: 0 });
            navigate('.', { replace: true });
            setTimeout(() => {
                alert('moved successfully');
            }, 0);
        });
    }

    function getFileById(id: any) {
        return files.find((file) => file.id == id);
    }

    function lockFolder() {
        const folderId = Object.keys(selected)[0];
        service.file.lockFolder({
            folderId: folderId,
            status: !getFileById(folderId)?.locked
        }).then(() => {
            setIsDragging(true);
            navigate('.', { replace: true });
            setTimeout(() => {
                setIsDragging(false);
                // alert('Successfully done');
            }, 0);
        });
    }

    function onBodyClick() {
        setContextMenu({ visible: false, x: 0, y: 0 });
    }


    const connectWebSocket = async () => {

        service.connectSocket();
        const socket = service.socket;

        socket.on('refresh', (data: any) => {
            console.log('refresh', data, socket.id);
            if (socket.id != data?.socketId) {
                navigate('.', { replace: true }); // Reload the component
            }
        });

        socket.on('browseFolder', (data: any,) => {
            console.log('browseFolder', data, socket.id);
            if (socket.id != data?.socketId) {
                navigate(`/items/${data.folderId}`);
            }
        });
    };

    if (isFetching) {
        component = <div className="has-text-centered mt-6">
            <h1 className="title">Loading...</h1>
        </div>;
    }
    else if (files.length === 0) {
        component = <div className="has-text-centered mt-6">
            <h1 className="title">No items found</h1>
            <h3>Please add items from <b>add folder</b> or <b>add item</b></h3>
        </div>;
    }
    else {
        component =
            <div className="items-container">
                <DndContext onDragCancel={onDragCancel} onDragMove={onDragMove} onDragStart={onDragStart} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={files} strategy={horizontalListSortingStrategy}>
                        {files.map((file, index) => {
                            return <FileItem isDragging={isDragging} key={file.id} file={file} onLongPress={onLongPress} isLongPressed={isLongPressed} selectFile={selectFile} selected={selected[file.id]} setContextMenu={setContextMenu} className="item" />
                        })}
                    </SortableContext>
                </DndContext>

            </div>
            ;
    }
    return <div onClick={onBodyClick} onContextMenu={onBodyContextMenu}>
        <Menu />
        {component}
        {isGroupItems && <GroupIntoFolder groupItems={groupItems} onGroupItemsCancel={onGroupItemsCancel} />}
        <Outlet />
        {contextMenu.visible && (
            <ul
                className="context-menu"
                style={{ top: contextMenu.y, left: contextMenu.x, position: 'absolute', zIndex: 1000 }}
            >
                {Object.keys(selected).length > 0 ? <>
                    <li onClick={groupIntoFolder}>
                        Group into folder
                    </li>
                    <li onClick={moveItems}>
                        Move items
                    </li>
                    {isFolderOnlySelected && <li onClick={lockFolder}>
                        {getFileById(Object.keys(selected)[0])?.locked ? "Unlock folder" : "Lock folder"}
                    </li>}
                </>
                    :
                    <li onClick={moveHere}>
                        Move here
                    </li>}
            </ul>
        )}
    </div>
}

export default Items;
