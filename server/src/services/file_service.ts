import { FilePayload } from "@/models";
import { BaseService } from "./base_service";
import { FILE_TYPE } from "@/enums/file_type";

export class FileService extends BaseService {
    getFiles(parentId) {
        return this.tables.FILE.findAll({
            where: {
                parentId
            },
            order: [['order', 'ASC']]
        })
    }

    createFile(payload: FilePayload) {
        return this.tables.FILE.create(payload as any);
    }

    groupItems(fileIds, parentId) {
        return this.tables.FILE.update({
            parentId
        }, {
            where: {
                id: fileIds
            }
        });
    }

    reorderItems(newOrder: { id: number, order: number }[]) {
        return this.tables.FILE.sequelize.transaction(async (t) => {
            const promises = newOrder.map((item) => {
                return this.tables.FILE.update({
                    order: item.order
                }, {
                    where: {
                        id: item.id
                    },
                    transaction: t
                });
            });
            return Promise.all(promises);
        });
    }

    async getFullPathFromFolderId(folderId: number): Promise<string[]> {
        const path = [];
        let currentId = folderId;

        while (currentId !== 0) {
            const folder = await this.tables.FILE.findOne({
                where: {
                    id: currentId
                }
            });
            if (folder) {
                if (folder.type === FILE_TYPE.Folder) {
                    path.unshift({
                        id: folder.id,
                        name: folder.name
                    });
                }
                currentId = folder.parentId;
            } else {
                break;
            }
        }

        path.unshift({
            id: 0,
            name: 'Home'
        })
        return path;
    }

    lockFolder(folderId, status) {
        return this.tables.FILE.update({
            locked: status
        }, {
            where: {
                id: folderId
            }
        });
    }
}
