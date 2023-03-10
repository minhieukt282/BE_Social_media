import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "relationship"})
export class Relationship {
    @PrimaryGeneratedColumn({type: 'bigint'})
    public readonly relationshipId: number
    @Column({type: 'bigint'})
    public accountReq: number
    @Column({type: 'bigint'})
    public accountRes: number
    @Column({type: "boolean", default: false})
    public isFriend : boolean
}
