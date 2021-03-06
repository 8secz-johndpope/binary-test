import { PropertyDefinition, PropertyType, RelationMetadata } from '@loopback/repository';
import { JsonSchema } from './index';
export interface JsonSchemaOptions<T extends object> {
    /**
     * The title to use in the generated schema.
     *
     * When using options like `exclude`, the auto-generated title can be
     * difficult to read for humans. Use this option to change the title to
     * a more meaningful value.
     */
    title?: string;
    /**
     * Set this flag if you want the schema to define navigational properties
     * for model relations.
     */
    includeRelations?: boolean;
    /**
     * Set this flag to mark all model properties as optional. This is typically
     * used to describe request body of PATCH endpoints. This option will be
     * overridden by the "optional" option if it is set and non-empty.
     *
     * The flag also applies to nested model instances if its value is set to
     * 'deep', such as:
     *
     * @example
     * ```ts
     * @model()
     * class Address {
     *  @property()
     *  street: string;
     *  @property()
     *  city: string;
     *  @property()
     *  state: string;
     *  @property()
     *  zipCode: string;
     * }
     *
     * @model()
     * class Customer {
     *   @property()
     *   address: Address;
     * }
     *
     * // The following schema allows properties of `customer` optional, but not
     * // `customer.address`
     * const schemaRef1 = getModelSchemaRef(Customer, {partial: true});
     *
     * // The following schema allows properties of `customer` and
     * // `customer.address` optional
     * const schemaRef2 = getModelSchemaRef(Customer, {partial: 'deep'});
     * ```
     */
    partial?: boolean | 'deep';
    /**
     * List of model properties to exclude from the schema.
     */
    exclude?: (keyof T)[];
    /**
     * List of model properties to mark as optional. Overrides the "partial"
     * option if it is not empty.
     */
    optional?: (keyof T)[];
    /**
     * @internal
     */
    visited?: {
        [key: string]: JsonSchema;
    };
}
/**
 * @internal
 */
export declare function buildModelCacheKey<T extends object>(options?: JsonSchemaOptions<T>): string;
/**
 * Gets the JSON Schema of a TypeScript model/class by seeing if one exists
 * in a cache. If not, one is generated and then cached.
 * @param ctor - Constructor of class to get JSON Schema from
 */
export declare function getJsonSchema<T extends object>(ctor: Function & {
    prototype: T;
}, options?: JsonSchemaOptions<T>): JsonSchema;
/**
 * Describe the provided Model as a reference to a definition shared by multiple
 * endpoints. The definition is included in the returned schema.
 *
 * @example
 *
 * ```ts
 * const schema = {
 *   $ref: '/definitions/Product',
 *   definitions: {
 *     Product: {
 *       title: 'Product',
 *       properties: {
 *         // etc.
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param modelCtor - The model constructor (e.g. `Product`)
 * @param options - Additional options
 */
export declare function getJsonSchemaRef<T extends object>(modelCtor: Function & {
    prototype: T;
}, options?: JsonSchemaOptions<T>): JsonSchema;
/**
 * Gets the wrapper function of primitives string, number, and boolean
 * @param type - Name of type
 */
export declare function stringTypeToWrapper(type: string | Function): Function;
/**
 * Determines whether a given string or constructor is array type or not
 * @param type - Type as string or wrapper
 */
export declare function isArrayType(type: string | Function | PropertyType): boolean;
/**
 * Converts property metadata into a JSON property definition
 * @param meta
 */
export declare function metaToJsonProperty(meta: PropertyDefinition): JsonSchema;
/**
 * Checks and return navigational property definition for the relation
 * @param relMeta Relation metadata object
 * @param targetRef Schema definition for the target model
 */
export declare function getNavigationalPropertyForRelation(relMeta: RelationMetadata, targetRef: JsonSchema): JsonSchema;
/**
 * Converts a TypeScript class into a JSON Schema using TypeScript's
 * reflection API
 * @param ctor - Constructor of class to convert from
 */
export declare function modelToJsonSchema<T extends object>(ctor: Function & {
    prototype: T;
}, jsonSchemaOptions?: JsonSchemaOptions<T>): JsonSchema;
