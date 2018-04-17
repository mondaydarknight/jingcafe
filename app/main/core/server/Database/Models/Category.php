<?php



namespace JingCafe\Core\Database\Models;




class Category extends Model
{

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


	/**
	 * Disable the timestamps settings.
	 */
	public $timestamps = false;





}


