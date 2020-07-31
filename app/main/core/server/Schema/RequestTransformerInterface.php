<?php


namespace JingCafe\Core\Schema;

/**
 * Represents a schema for HTTP request.
 *
 *
 */
interface RequestTransformerInterface
{
	/**
	 * Set the schema for this trnasformer, as a valid RequestSchemaInterface object.
	 * 
	 * @param RequestInterface 	$schema 	RequestSchemaInterface obejct, containing the transformation rules.
	 */
	public function setSchema(RequestSchemaInterface $schema);

	/**
     * Process each field in the specified data array, applying transformations in the specified order.
     *
     * Example transformations: escape/purge/purify HTML entities
     * Also, set any default values for unspecified fields.
     *
     * @param array $data The array of data to be transformed.
     * @param string $onUnexpectedVar[optional] Determines what to do when a field is encountered that is not in the schema.  Set to one of:
     * "allow": Treat the field as any other, allowing the value through.
     * "error": Raise an exception.
     * "skip" (default): Quietly ignore the field.  It will not be part of the transformed data array.
     * @return array The array of transformed data, mapping field names => values.
     */
	public function transform(array $data, $onUnexpectedVar);

	/**
	 * Transform a raw field value.
	 *
	 * @param string 	$name 	The name of thie field to transform, as specified in the schema
	 * @param strinb 	$value 	The value to be transformed.
	 * @return string 	The transformed value
	 */
	public function transformField($name, $value);

}



