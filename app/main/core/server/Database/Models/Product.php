<?php






namespace JingCafe\Core\Database\Models;




class Product extends Model 
{

	/**
	 * @var encrypted columns
	 */
	const ENCRYPTED_COLUMNS = ['name', 'characteristic', 'description'];

	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'products';

	/**
	 * Field should be mass-assignable when creating a new Product
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'en_name',
		'amount',
		'product_key',
		'price',
		'profile',
		'discount',
		'purchase_times',
		'characteristic',
		'description',
		'locale_id',
		'logistics_id',
		'last_category_id',
		'shop_id',
		'flag_enabled',
		'updated_at',
		'created_at'
	];
	
	/**
	 * Enable timestamps for Product
	 */
	public $timestamps = false;
	

	/**
	 * Return this product's categories 
	 * belongsTo()->item
 	 */
	public function category()
	{
		$classMapper = static::$container->classMapper;

		return $this->belongsTo('JingCafe\Core\Database\Models\Category', 'last_category_id');
	}

	/**
	 * 
	 *
	 */
	public static function translateDiscountAnPriceColumn($product)
	{
		$product->discount = $product->discount / 10;
		$product->currentPrice = round($product->price * $product->discount / 10);
	}


} 
