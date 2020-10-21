import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'pos-calculator',
  templateUrl: './pos-calculator.component.html',
  styleUrls: ['./pos-calculator.component.css']
})
export class PosCalculatorComponent {
	@Input() output: string;
	@Output() updateQty: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * Update the calculated value as quantity
	 * @param value 
	 */
	updateOutput(value: string, isManual = false) {
		this.output = isManual ? String(value) : this.output + String(value);
		this.updateQty.emit(this.output);
	};
}
