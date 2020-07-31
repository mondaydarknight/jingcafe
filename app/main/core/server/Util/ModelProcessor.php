<?php

namespace JingCafe\Core\Util;

class ModelProcessor
{

	protected static $userColumns = [
		'username', 
		'email', 
		'phone', 
		'branchName'
	];

	protected static $productColumns = [
		'id', 
		'name', 
		'amount', 
		'profile', 
		'price', 
		'totalPrice', 
		'quantity'
	];

	/**
	 * Decrypt or decode orders from database.
	 * @param array[mixed] 		$orders
	 * @param array|Closure 	$callback
	 */
	public static function process($model, array $params)
	{
		if (!$model) {
			return $model;
		}

		$model = Util::convertArrayKeyToCamelCase($model, ['user_logistic', 'user_payment']);

		if (!empty($params)) {
			foreach ($params as $callbackKey => $callback) {			
				if (static::validateCallbackInClass($callback)) {
					tap($model, static::$callback());
				} elseif (array_key_exists($callbackKey, $params) && static::validateCallbackInClass($callbackKey)) {
					// You  can use call_user_func_array('func',$myArgs);
					// Or call_user_func_array(array($instance, "MethodName"), $myArgs);
					// Or new ReflectionFunction('title')->invokeArgs(arguments);
					// Since 5.6+, PHP create ...arguments (operator) as part of the variadic functions functionality
					// argument unpacking (as shown above) is the fastest method by far in all cases. In some cases, 
					// it's over 5x faster than call_user_func_array.					
						
					$arguments = is_array($callback) ? $callback : [$callback];
					tap($model, static::$callbackKey(...$arguments));
				} else {
					throw new NotFoundException('Undefined callback method.');					
				}
			}
		} elseif (is_callable($params)) {
			tap($model, $params);
		}

		return $model;
	}


	/**
	 * Decode the list of model.
	 *
	 * @todo decrypt the info of user and json decode the model's products.
	 */
	public static function decodeProducts()
	{
		$calculateProductTotalPrice = function($products) {
			$productTotalPrice = 0;

			foreach ($products as $product) {
				$productTotalPrice += $product->totalPrice;
			}

			return $productTotalPrice;
		};

		return function($model) use ($calculateProductTotalPrice) {
			if (isset($model->products)) {
				$model->products = json_decode($model->products);
				$model->productTotalPrice = $calculateProductTotalPrice($model->products);
			}		
		};
	}


	/**
	 * Decrypt the user information
	 * @param bool $isRetianPlainText  Set default false to hide every char to user's information
	 *
	 */	
	public static function decryptUserLogistic()
	{
		return function($model) {
			$columns = static::$userColumns;

			foreach ($columns as $column) {
				if (isset($model->{$column})) {
					$model->{$column} = CBMCryptography::decrypt($model->{$column});
				}
			}

			$model->address = OpenSSLCryptography::decrypt($model->address);		
		};
	}


	/**
	 * Decrypt the user payment 
	 * 
	 * @param bool $isRetainPlainText
	 */
	public static function decryptUserPayment($isRetainPlainText = false)
	{
		return function ($model) use ($isRetainPlainText) {
			if (empty($model->account)) {
				return;
			}

			$model->account = OpenSSLCryptography::decrypt($model->account);
			
			if (!$isRetainPlainText) {
				$model->account = static::replacePartPlainText($model->account);
			}
		};
	}

	/**
	 * Filter the element of array product by productColumns
	 *
	 * @param array $product
	 * @return array
	 */ 
	public static function filterProductColumns(array $product)
	{
		return array_intersect_key($product, array_flip(static::$productColumns));
	}

	/**
	 * Validate the callback in the class
	 * 
	 * @param string method name
	 */
	protected static function validateCallbackInClass($methodName)
	{
		if (!method_exists(__CLASS__, $methodName)) {
			return false;
		}

		return true;
	}


	/**
	 * replace the char with * 
	 */
	protected static function replacePartPlainText($value, $hideIndex = 1)
	{
		$textLength = strlen($value);

		return $textLength > 1 
			? substr_replace($value, str_repeat('*', $textLength - $hideIndex), $hideIndex)
			: $value;
	}




}
