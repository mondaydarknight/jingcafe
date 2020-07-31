<?php



namespace JingCafe\Core\Database\Models;




class Category extends Model
{

	/**
	 * Disable the timestamps settings.
	 */
	public $timestamps = false;

	/**
	 * The name of current table
	 * @var string
	 */
	protected $table = 'category';

	/**
	 *
	 *
	 *
	 */
	protected $fillable = [
		'name',
		'uri'
	];





	public function product()
	{
		return $this->belongsTo('JingCafe\Core\Database\Models\Product');
	}



}


