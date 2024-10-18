import { FILE_TYPE } from "@/enums/file_type";
import { IsString, IsNumber } from "class-validator";

export class FilePayload {

    id: number;

    @IsString()
    name: string;

    @IsString()
    type: FILE_TYPE;

    parentId: number;

    order: number;

    constructor(data: any) {
        this.id = data.id || Number(data.id);
        this.name = data.name;
        this.type = data.type;
        this.parentId = data.parentId;
        this.order = data.order;
    }
}
