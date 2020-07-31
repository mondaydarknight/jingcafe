import adminLobbyTemplate 	from './admin-lobby.template.html';
import EasyPieChart 		from 'easy-pie-chart';

class AdminLobbyController {

	constructor($document, $timeout, EventListener, Util, CONSTANTS) {
		'ngInject';

		this.$document = $document;
		this.$timeout = $timeout;
		this.EventListener = EventListener;
		this.Util = Util;
		this.CONSTANTS = CONSTANTS;
	}

	$onInit() {
		this.EventListener.broadcast('isLoaderActive', false);
		
		this.dailyStatistics = [
			{
				name: '本日訂購量',
				percent: 46,
				amount: 23
			},
			{
				name: '在線人數',
				percent: 34,
				amount: 14
			},
			{
				name: '新會員',
				percent: 33,
				amount: 30
			},
			{
				name: '本日利潤',
				percent: 28,
				amount: 24
			}	
		];

		this.$timeout(() => this.initDailyStatistics(), 1000);
	}

	initDailyStatistics() {
		const charts = this.$document[0].body.querySelectorAll('.chart');
		const pieElements = {
			easing: 'easeOutBounce',
			barColor: this.Util.hexToRGB('#666666', 0.2), 
			trackColor: 'rgba(0, 0, 0, 0)',
			size: 84,
			scaleLength: 0,
			animation: 2000,
			lineWidth: 9,
			lineCap: 'round'
		};

		for (let i=0; i<charts.length; i++) {
			new EasyPieChart(charts[i], pieElements);
		}
	}
	

}


export const adminLobbyComponent = {
	template: adminLobbyTemplate,
	controller: AdminLobbyController,
	controllerAs: '$vm',
	bindings: {}
};

