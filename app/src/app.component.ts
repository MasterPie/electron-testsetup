declare var ipc: any;

import {View, Component} from 'angular2/core';

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'views/main.html'
})
export class AppComponent {
	fib : string;
	constructor(){
		this.fib = "";
	}
	
	sayMyName(val)
	{
		ipc.send("function_exec", val);
		this.fib = "started!";
	}
 }