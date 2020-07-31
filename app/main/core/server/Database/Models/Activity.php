<?php


namespace JingCafe\Core\Database\Models;


class Activity extends Model
{
	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'activities';

	/**
	 * Field should be mass-assignable when creating a new Product
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'title',
		'conext',
		'shop_id',
		'created_at',
		'view_level'
	];

	/**
	 * Enable timestamps for Product
	 */
	public $timestamps = false;



	public function shop() 
	{
		return $this->belongsTo('JingCafe\Core\Database\Models\Shop', 'shop_id');
	}


}

