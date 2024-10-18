import { useNavigate } from "react-router-dom";
import { STORE } from "../../store";
import { useState } from "react";
import { service } from "../../services";
import FileItem from "./file_item";

function NewItem({ groupItems, onGroupItemsCancel }: any) {
    const { add, parentId, files } = STORE.file();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");
    const [isNewFolder, setIsNewFolder] = useState(false);

    const addNewFile = async () => {
        const payload = { type: "folder", name: fileName, parentId, order: files.length + 1 };
        const newFile = await service.file.addFile(payload);
        add(newFile);
        setIsNewFolder(false);
        // goBack();
    }

    function goBack() {
        onGroupItemsCancel();
    }

    // bulma modal
    return <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card" style={{ maxWidth: '500px' }}>
            <header className="modal-card-head">
                <p className="modal-card-title">Select folder to group items</p>
                <button onClick={goBack} className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
                <div className="has-text-centered">
                    <button className="button" onClick={() => { setIsNewFolder(true) }}>
                        <span className='icon'>
                            <i className='fa-solid fa-folder-plus'></i>
                        </span>
                        <span>
                            Add new folder
                        </span>
                    </button>
                </div>
                {isNewFolder && <div>
                    <div className="field">
                        <label className="label">
                            Enter foldername
                        </label>
                    </div>
                    <div className="field has-addons mb-6">
                        <div className="control is-widthfull">
                            <input value={fileName} onInput={(e) => { setFileName(e.currentTarget.value) }} className="input" type="text" placeholder="Text input" />
                        </div>
                        <div className="control">
                            <button onClick={addNewFile} className="button is-info">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
                }
                <div className="items-container">
                    {files.filter(file => file.type === 'folder').map((file, index) => {
                        return <FileItem groupSelectedItems={groupItems} isGroupItems={true} key={index} file={file} onLongPress={() => { }} isLongPressed={false} selectFile={() => { }} selected={false} setContextMenu={() => { }} className="item" />
                    })}
                </div>
            </section>
            {/* <footer className="modal-card-foot is-flex is-justify-content-center">
                <div className="buttons">
                    <button className="button is-success" onClick={groupItems}>Group items</button>
                    <button className="button" onClick={goBack}>Cancel</button>
                </div>
            </footer> */}
        </div>
    </div>
}

export default NewItem;
