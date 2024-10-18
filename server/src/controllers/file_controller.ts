import { FilePayload } from "@/models";
import { FileService } from "@/services/file_service";
import { socket } from "@/websocket";
import { Controller, http, singleton, jsonResult, validate } from "fortjs";

export class FileController extends Controller {

    constructor(@singleton(FileService) public fileService: FileService) {
        super();
    }

    @http.get("/{parentId}")
    async getFiles() {
        const files = await this.fileService.getFiles(this.param.parentId);
        return jsonResult(files);
    }

    @http.post("/")
    @validate.body(FilePayload)
    async createFile() {
        const files = await this.fileService.createFile(this.body as FilePayload);
        socket.refreshPage(1);
        return jsonResult(files);
    }

    @http.post("/group-items")
    async groupItems() {
        const fileIds = this.body.fileIds;
        const parentId = this.body.parentId;
        await this.fileService.groupItems(fileIds, parentId);
        socket.refreshPage(1);
        return jsonResult({
            message: 'Files grouped successfully'
        });
    }

    @http.post("/reorder")
    async reorderItems() {
        const newOrder = this.body;
        await this.fileService.reorderItems(newOrder as any);
        socket.refreshPage(1, this.query.socketId);
        return jsonResult({
            message: 'Files reordered successfully'
        });
    }

    @http.get("/paths/{folderId}")
    async getPathsFromFolderId() {
        const { folderId } = this.param;
        const result = await this.fileService.getFullPathFromFolderId(folderId as any);
        socket.browseFolder(1, folderId, this.query.socketId);
        return jsonResult({
            result: result
        });
    }

    @http.post("/move")
    async moveItems() {
        const fileIds = this.body.fileIds;
        const parentId = this.body.parentId;
        await this.fileService.groupItems(fileIds, parentId);
        socket.refreshPage(1);
        return jsonResult({
            message: 'Items moved successfully'
        });
    }

    @http.post("/lock/")
    async lockFolder() {
        const folderId = this.body.folderId;
        const status = this.body.status;
        await this.fileService.lockFolder(folderId, status);
        socket.refreshPage(1);
        return jsonResult({
            message: 'Folder locked successfully'
        });
    }
}
