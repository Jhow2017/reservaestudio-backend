import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<Props> {
    protected readonly _id: UniqueEntityID;
    protected props: Props;

    protected constructor(props: Props, id?: UniqueEntityID) {
        this._id = id ?? new UniqueEntityID();
        this.props = props;
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    public equals(entity: Entity<Props>): boolean {
        if (entity === this) {
            return true;
        }

        return entity.id.equals(this._id);
    }
}