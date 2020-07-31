<?php



namespace JingCafe\Core\Util;

/** 
 * Util Class Mapper
 * 
 * This creates an abstraction layer for overrideable class.
 * For example, if if we want to replace usages of the User with MyUser, this abstraction layer handles that.
 */
class ClassMapper {


 	protected $classMapperCollection = [];

 	/**
 	 * Creates an instance for a requested class identifier
 	 *
	 * @param string $identifier The identifier for the class, e.g. 'user'
 	 * @param mixed ...$arg Whatever needs to be passed to the constructor
 	 */
 	public function createInstance($identifier)
 	{
 		$className = $this->getClassMapper($identifier);

 		$params = array_slice(func_get_args(), 1);

 		// We must use reflection in PHP < 5.6 See http://stackoverflow.com/questions/8734522/dynamically-call-class-with-variable-number-of-parameters-in-the-constructor
 		$reflection = new \ReflectionClass($className);

        return $reflection->newInstanceArgs($params);
 	}


	/**
	 * Set Model to ClassMapper
	 *
	 * @param string 	$identifier 	The identifier 
	 */
	public function setClassMapper($identifier, $class)
	{
		if (!class_exists($class)) {
			throw new BadClassNameException("Unable to find class $class.");
		}

		$this->classMapperCollection[$identifier] = $class;
		return $this;
	}

	/**
	 * Get the specified class mapper.
	 *
	 * @param string 	$identifier
	 * @return Class  	Model 
	 */
	public function getClassMapper($identifier) 
	{
		if (isset($this->classMapperCollection[$identifier])) {
			return $this->classMapperCollection[$identifier];
		}

		throw new \OutOfBoundsException("There is no class mapped to the identifier '$identifier'.");
	}

	/**
	 * Call a static method for a specified class
	 *
	 * @deprecated call_user_func_array
	 * @todo Use the unpacking argument. It's fastest 
	 * @param string 	$identifier 	The identifier of class
	 * @param string 	@method Name 	
	 * @param mixed 	args whatever needs to pass the method.
	 */
	public function staticMethod($identifier, $methodName)
	{
		$className = $this->getClassMapper($identifier);

		// $params = array_slice(func_get_args(), 2);
		$parameters = array_slice(func_get_args(), 2);

		// return call_user_func_array("$className::$methodName", $params);

		return $className::$methodName(...$parameters);
	}


}
