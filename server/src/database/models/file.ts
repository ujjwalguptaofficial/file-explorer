import { FILE_TYPE } from "@/enums/file_type";
import { BelongsToMany, Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "FILE"
})
export class File extends Model {
    @Column({
        type: DataType.INTEGER({
            unsigned: true
        }),
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    @Index
    name: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(FILE_TYPE))
    })
    type: FILE_TYPE;

    @Column({
        allowNull: true,
        type: DataType.INTEGER({
            unsigned: true
        })
    })
    @ForeignKey(() => File)
    parentId: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER({
            unsigned: true
        })
    })
    order: number;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    locked: boolean;
}
