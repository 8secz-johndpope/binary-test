import { Entity, EntityCrudRepository, Getter, HasManyDefinition } from '../..';
import { HasManyThroughRepository } from './has-many-through.repository';
/**
 * a factory to generate hasManyThrough repository class.
 *
 * Warning: The hasManyThrough interface is experimental and is subject to change.
 * If backwards-incompatible changes are made, a new major version may not be
 * released.
 */
export declare type HasManyThroughRepositoryFactory<TargetEntity extends Entity, TargetID, ThroughEntity extends Entity, SourceID> = (fkValue: SourceID) => HasManyThroughRepository<TargetEntity, TargetID, ThroughEntity>;
export declare function createHasManyThroughRepositoryFactory<Target extends Entity, TargetID, Through extends Entity, ThroughID, SourceID>(relationMetadata: HasManyDefinition, targetRepositoryGetter: Getter<EntityCrudRepository<Target, TargetID>>, throughRepositoryGetter: Getter<EntityCrudRepository<Through, ThroughID>>): HasManyThroughRepositoryFactory<Target, TargetID, Through, SourceID>;
