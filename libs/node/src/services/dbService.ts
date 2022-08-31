import {
  Model,
  FilterQuery,
  QueryOptions,
  ProjectionType,
  HydratedDocument,
  QueryWithHelpers,
} from 'mongoose';
import { EntityType, IModel, ReturnDocument } from '../types';

// create
export async function create<T extends EntityType>(
  Modal: Model<T>,
  data: Partial<T>
): Promise<ReturnDocument> {
  const modalInstance = new Modal(data);
  return await modalInstance.save();
}
// update
export async function update<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>,
  data: Partial<T>
): Promise<ReturnDocument | undefined> {
  await getOne(Modal, query);
  const result = await Modal.findOneAndUpdate(query, data, { new: true });
  return result || undefined;
}
// soft-delete
export async function remove<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>
): Promise<ReturnDocument> {
  const modalInstance = await getOne(Modal, query);
  return await modalInstance.remove();
}
// get-all
export function getAll<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType> = {},
  options?: QueryOptions<EntityType>,
  projection?: ProjectionType<EntityType>
  // eslint-disable-next-line @typescript-eslint/ban-types
): QueryWithHelpers<Array<T>, T, {}, T> {
  return Modal.find(query, projection, options);
}
// list
export async function list<T extends EntityType>(
  Modal: IModel<T>,
  where: FilterQuery<T>,
  options: QueryOptions<T>
): Promise<ReturnDocument[]> {
  try {
    const documents = Modal.paginate(where, options);
    return documents;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
// get-one
export async function getOne<T extends EntityType>(
  Modal: Model<T>,
  query: FilterQuery<EntityType>,
  projection?: ProjectionType<EntityType>
): Promise<HydratedDocument<T>> {
  const modalInstance: HydratedDocument<T> | null = await Modal.findOne(
    query,
    projection
  );
  if (!modalInstance) throw new Error(`Record not found in ${Modal.name}`);

  return modalInstance;
}
