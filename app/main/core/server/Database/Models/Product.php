<?php






namespace JingCafe\Core\Database\Models;




class Product extends Model 
{
	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'product';

	/**
	 * Field should be mass-assignable when creating a new Product
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'amount',
		'product_key',
		'price',
		'characteristic',
		'description',
		'locale_id',
		'logistics_id',
		'last_category_id',
		'shop_id',
		'flag_enabled',
		'last_update_time'
	];
	
	/**
	 * Enable timestamps for Product
	 */
	public $timestamps = false;
	

	/**
	 * Return this product's category 
	 */
	public function category()
	{
		$classMapper = static::$container->classMapper;

		return $this->belongsTo($classMapper->getClassMapper('category'), 'last_category_id');
	}


	


} 
