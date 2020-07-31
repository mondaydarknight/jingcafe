<?php

namespace JingCafe\Core\Notification;

use JingCafe\Core\Database\Models\User;
use JingCafe\Core\Util\CBMCryptography;

class PaymentNotification extends Notification
{
	
	/**
	 * @var const
	 */
	const ICON = 'iconCoin';

	/**
	 * @var const
	 */
	const TITLE = '付款通知';


	public function all()
	{
		return $this->config['cache']->get('notification');
	}

	public function get()
	{
		return $this->config['cache']->get("notification{$this->config['name']}") ?: [];
	}

	public function put(User $user)
	{
		$continueMinutes = ($this->config['continue_day'] ?: 3) * 24 * 3600;
		$notifications = $this->get();
		$notifications[] = $this->create($user);

		$this->config['cache']->put("notification{$this->config['name']}", $notifications, $continueMinutes);
		return $this;
	}

	public function create($user)
	{
		return [
			'icon'		=> $this->generateIcon(),
			'title' 	=> $this->generateTitle(),
			'context' 	=> $this->generateContext($user),
			'dateTime'	=> '',
		];
	}

	protected function generateContext($user)
	{
		return CBMCryptography::decrypt($user->username) . '完成付款 請核對帳戶是否有誤';
	}

		

}


