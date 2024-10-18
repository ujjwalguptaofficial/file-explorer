import { useEffect, useState } from "react";
import { STORE } from "../../store";
import { Link, useParams } from "react-router-dom";
import { service } from "../../services";

function Menu() {
    const { parentId } = STORE.file();
    const { folderId } = useParams();
    const [paths, setPaths] = useState<any[]>([]);
    function createBreadCrumb() {
        service.file.getPathsFromParentId(folderId as any, service.socket.id).then((res) => {
            setPaths(res.result);
        });
    }
    useEffect(() => {
        createBreadCrumb();
    }, [folderId])
    return <div>
        <div className='has-text-centered mt-5'>
            <Link to={`/items/${parentId}/new-folder`} className='button'>
                <span className='icon'>
                    <i className='fa-solid fa-folder-plus'></i>
                </span>
                <span>
                    Add folder
                </span>
            </Link>
            <Link to={`/items/${parentId}/new-item`} className='button ml-4'>
                <span className='icon'>
                    <i className="fa-solid fa-file-circle-plus"></i>
                </span>
                <span>
                    Add item
                </span>
            </Link>
            {/* <button className="button ml-5">
                <span className='icon'>
                    <i className="fa-solid fa-check"></i>
                </span>
                <span>
                    Select Items
                </span>
            </button> */}
        </div>
        <div className="has-text-centered ml-5 mt-2">
            <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    {
                        paths.map(path => {
                            return <li key={path.id}>
                                {/* <a href="#">{path.name}</a> */}
                                <Link to={`/items/${path.id}`} className=''>
                                    <span>
                                        {path.name}
                                    </span>
                                </Link>
                            </li>
                        })
                    }

                    {/* <li className="is-active"><a href="#" aria-current="page">Breadcrumb</a></li> */}
                </ul>
            </nav>
        </div>
    </div>
}

export default Menu;
