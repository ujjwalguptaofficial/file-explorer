export class FileService {
    constructor(public baseUrl: string) {

    }

    getFiles(parentId = 0) {
        return fetch(`${this.baseUrl}/file/${parentId}`).then(res => res.json())
    }

    addFile(payload: any) {
        return fetch(`${this.baseUrl}/file`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }

    groupItems(payload: any) {
        return fetch(`${this.baseUrl}/file/group-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }

    reorderItems(payload: any, socketId: any) {
        debugger;
        return fetch(`${this.baseUrl}/file/reorder?socketId=${socketId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }

    getPathsFromParentId(parentId = 0, socketId: any) {
        return fetch(`${this.baseUrl}/file/paths/${parentId}?socketId=${socketId}`).then(res => res.json())
    }

    moveItems(payload: any) {
        return fetch(`${this.baseUrl}/file/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }

    lockFolder(payload: any) {
        return fetch(`${this.baseUrl}/file/lock`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }
}
