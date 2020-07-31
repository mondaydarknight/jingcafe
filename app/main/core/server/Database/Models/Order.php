<?php


namespace JingCafe\Core\Database\Models;

use Closure;
use Carbon\Carbon;
use JingCafe\Core\Exception\NotFoundException;
use JingCafe\Core\Util\ModelProcessor;
use JingCafe\Core\Util\CBMCryptography;
use JingCafe\Core\Util\ClassMapper;
use JingCafe\Core\Util\OpenSSLCryptography;


class Order extends Model
{	
	/**
	 * @var array 	The type of orders
	 */
	const TYPE = [
		'all',
		'unpaid',
		'produced',
		'completed',
		'canceled'
	];
	
	public static $overviewColumns = [
		'id',
		'products', 
		'logistic_fee',
		'total_price',
		'message',
		'status',
		'paid',
		'user_id', 
		'user_logistic_id', 
		'user_payment_id', 
		'cancel_reason_id',
		'created_at',
		'expired_at',
		'paid_at',
		'produced_at',
		'expired_at',
		'canceled_at',
		'prize'
	];

	/** 
	 * Enable timestamps for User
	 * @var bool
	 */
	public $timestamps = false;

	/**
	 * @var array[mixed] 
	 */
	protected static $orderComposition = [
		[
			'name'		=> '待付款',
			'status' 	=> 'W',
			'type'		=> 'unpaid',
			'time' 		=> 'created_at'
		],
		[
			'name'		=> '待出貨',
			'status' 	=> 'P',
			'type'		=> 'produced',
			'time'		=> 'paid_at'
		],
		[
			'name'		=> '完成',
			'status' 	=> 'C',
			'type'		=> 'completed',
			'time'		=> 'produced_at'
		],
		[
			'name'		=> '取消',
			'status' 	=> 'D',
			'type'		=> 'canceled',
			'time'		=> 'canceled_at'
		]
	];


	protected static $dateTime = ['today', 'yesterday', 'week', 'month'];


	protected static $userColumns = ['username', 'email', 'phone', 'order_id'];


	/**
	 * @var payments
	 */
	protected $table = 'orders';

	/**
	 * Fields that should be mass-assignable when creating a new User.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'products',
		'logistic_fee',
		'total_price',
		'message',
		'status',
		'paid',
		'shop_id',
		'user_id',
		'user_payment_id',
		'user_logistic_id',
		'cancel_reason_id',
		'created_at',
		'paid_at',
		'produced_at',
		'completed_at',
		'expired_at',
		'canceled_at',
		'prize'
	];


	/**
	 *
	 * @return array 
	 */
	public static function withUserPaymentAndLogistic()
	{		
		return ['userLogistic.logistic', 'userPayment.payment'];
	}
	
	/**
	 * Get orders by type
	 * @param string $type
	 * @param Model $user
	 *
	 * @return array
	 */
	public static function getOrdersByType($type, User $user)
	{
		$orderComponent = static::getOrderComponentByType($type);

		$statement = static::select(static::$overviewColumns)
			->with(static::withUserPaymentAndLogistic())
			->where(['status' => $orderComponent['status'], 'user_id' => $user->id])
			->orderBy('id', 'desc');

		if ($orderComponent['status'] === 'D') {
			$statement->with('cancelReason');
		}

		return $statement->get();
	}

	/**
	 * Alter order status and update status time
	 * 
	 * @param string 	$type 			The type of order
	 * @param array 	$orderIndexes 	The set of order_id
	 */
	public static function alter($type, array $orderIndexes, array $columns = [])
	{
		$classMapper = static::$container->classMapper;
		$orderComponent = static::getOrderComponentByType($type);

		$columns = array_merge($columns, [
			'status' 				=> $orderComponent['status'],
			$orderComponent['time'] => Carbon::now()
		]);

		if ($orderComponent['status'] !== 'D') {
			return static::whereIn('id', $orderIndexes)->update($columns);
		}

		$orders = static::whereIn('id', $orderIndexes)->get();
		
		foreach ($orders as $order) {
			static::recoverProductAmount($order, $classMapper);
			$order->fill($columns)->save();
		}

		return $orders;
	}


	/**
	 * Get order composition settings
 	 * 
 	 * @return array
	 */
	public static function getComposition()
	{
		return static::$orderComposition;
	}



	/**
	 * Get orders by datetime
	 *
	 * @param string 	$dateTimeType
	 * @param array 	$params
	 *
	 * @return array|[] 	$orders
	 */
	public static function getAllOrdersByDateTime($dateTimeType, $params)
	{
		$orders = null;
		$whereDateTime = static::whereDateTime($dateTimeType, $params);

		foreach (static::$orderComposition as $order) {
			$queryOrders = static::select(static::$overviewColumns)
				->with(static::withUserPaymentAndLogistic())
				->where('status', $order['status'])
				->whereBetween($order['time'], $whereDateTime)
				->orderBy('id', 'desc')
				->get();	
			
			$orders = $orders ? $orders->merge($queryOrders) : $queryOrders;
		}

		return $orders;
	}


	/**
	 * Query search orders by user column
	 * 
	 * @param string $userType
	 * @param string input
	 *
	 * @return array|null orders 
	 */
	public static function getAllOrdersByUser($userType, $input) 
	{
		if (!in_array($userType, static::$userColumns)) {
			throw new NotFoundException("Undefiend query type: {$userType}, please check your request.");
		}

		$input = CBMCryptography::encrypt($input);

		return static::select(static::$overviewColumns)
			->with(static::withUserPaymentAndLogistic())
			->whereHas('userLogistic', static::searchByUserColumn($userType, $input))
			->orderBy('id', 'desc')->get();
	}


	/**
	 * Get timestamp range by $dateTimeType
	 *
	 * @param string 	$dateTimeType
	 *
	 * @param array
	 */
	public static function whereDateTime($dateTimeType, $params)
	{
		$timeParamsMethod = 'get'.ucfirst($dateTimeType).'Params';  
		
		if (!method_exists(__CLASS__, $timeParamsMethod)) {
			
		}

		return static::$timeParamsMethod($params);
	}



	/**
	 * Get the data of relationship of user_logsitcs
	 * @return QueryBuilder
	 */
	public function userLogistic()
	{
		$classMapper = static::$container->classMapper;
		return $this->belongsTo($classMapper->getClassMapper('userLogistic'), 'user_logistic_id');
	}

	/**
	 * Get the data of relationship of user_payments
	 * @return QueryBuilder
	 */
	public function userPayment()
	{
		$classMapper = static::$container->classMapper;
		return $this->belongsTo($classMapper->getClassMapper('userPayment'), 'user_payment_id');
	}

	/**
	 * Get the data of relationship of user_logistics
	 *
	 * @return QueryBuilder
	 */
	public function cancelReason() 
	{
		$classMapper = static::$container->classMapper;
		return $this->belongsTo($classMapper->getClassMapper('cancelReasons'), 'cancel_reason_id');
	}







	/** 
	 * Get the component of the order by type search
	 * @param string $type
	 * @return arrray
	 */
	protected static function getOrderComponentByType($type)
	{
		$orderComponent = null;

		foreach (static::$orderComposition as $order) {		
			if ($order['type'] && $order['type'] === $type) {
				$orderComponent = $order;
				break;
			}
		}

		if (!$orderComponent) {
			throw new NotFoundException("Unknown order type: {$type}.");
		}

		return $orderComponent;
	}

	/**
	 * Get today's timestamp range
	 *
	 * @return array
	 */
	protected static function getTodayParams()
	{
		return [Carbon::today(), Carbon::tomorrow()];
	}

	/**
	 * Get yesterday timestamp range
	 *
	 * @return array
	 */
	protected static function getYesterdayParams()
	{
		return [Carbon::today()->subDays(1), Carbon::now()];
	}

	
	/**
	 * Get week timestamp range
	 *
	 * @return array
	 */
	protected static function getWeekParams()
	{	
		return [Carbon::today()->subWeeks(1), Carbon::now()];
	}


	/**
	 * Get month timestamp range
	 * 
	 * @return array
	 */
	protected static function getMonthParams()
	{
		return [Carbon::today()->subMonths(1), Carbon::now()];
	}

	/**
	 *
	 */
	protected static function getArbitaryParams() 
	{

	}	

	protected static function searchByUserColumn($userType, $input)
	{
		return function($query) use ($userType, $input) {
			return $query->where($userType, 'LIKE', '%'.$input.'%');
		};
	}


	/**
	 * Recover the amount of the product
	 *
	 * @param Object order
	 * @param ClassMapper 
	 */
	protected static function recoverProductAmount($order, ClassMapper $classMapper)
	{
		foreach (json_decode($order->products) as $product) {
			$productModel = $classMapper->staticMethod('product', 'findOrFail', $product->id);
			$productModel->amount += $product->quantity;
			$productModel->save();
		}
	}





}



