import { useNavigate } from "react-router-dom";
import { STORE } from "../../store";
import { useState } from "react";
import { service } from "../../services";

function NewItem() {
    const { add, parentId, files } = STORE.file();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");

    const addNewFile = async () => {
        // validate file extension
        if (!fileName.match(/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/)) {
            alert("Invalid file name");
            return;
        }
        const payload = { type: "file", name: fileName, parentId, order: files.length + 1 };
        const newFile = await service.file.addFile(payload);
        add(newFile);
        goBack();
    }

    function goBack() {
        navigate(-1); // Go back to the previous page
    }

    // bulma modal
    return <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card" style={{ maxWidth: '500px' }}>
            <header className="modal-card-head">
                <p className="modal-card-title">Add new item</p>
                <button onClick={goBack} className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
                <div className="field">
                    <label className="label">
                        Enter filename with extension
                    </label>
                    <div className="control">
                        <input value={fileName} onInput={(e) => { setFileName(e.currentTarget.value) }} className="input" type="text" placeholder="Text input" />
                    </div>
                </div>
            </section>
            <footer className="modal-card-foot">
                <div className="buttons">
                    <button className="button is-success" onClick={addNewFile}>Save</button>
                    <button className="button" onClick={goBack}>Cancel</button>
                </div>
            </footer>
        </div>
    </div>
}

export default NewItem;
