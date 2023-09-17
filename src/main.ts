import 'zone.js/dist/zone';
import {
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <h1>Shopping Cart</h1>
      <select
        [ngModel]="quantity()"
        (change)="onQuantitySelected($any($event.target).value)">
        <option disabled value="">--Select a quantity--</option>
        <option *ngFor="let q of qtyAvailable()">{{ q }}</option>
      </select>
      <div>Vehicle: {{ selectedVehicle().name}}</div>
      <div>Price: {{ selectedVehicle().price | number: '1.2-2'}}</div>
      <div style="font-weight: bold" [style.color]="color()">Total: {{ exPrice()  | number: '1.2-2' }}</div>
      <div *ngFor="let v of vehicles()">
        {{ v.name }}
      </div>
  `,
})
export class App {
  quantity = signal<number>(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);


  selectedVehicle = signal<Vehicle>({ id: 1, name: 'AT-AT', price: 10000 });

  vehicles = signal<Vehicle[]>([]);

  exPrice = computed(() => this.selectedVehicle().price * this.quantity());
  color = computed(() => this.exPrice() > 50000 ? 'green' : 'blue');

  constructor() {
    console.log(this.quantity());

    // Two for one sale
    this.quantity.update((qty) => qty * 2);

    // Interstellar price increase
    this.selectedVehicle.mutate((v) => v.price = v.price + (v.price * 0.2));

    // Add selected vehicle to array
    this.vehicles.mutate(v => v.push(this.selectedVehicle()))

    // Example of an effect
    effect(() => console.log(JSON.stringify(this.vehicles())));
  }

  // Example of a declarative effect
  qtyEff = effect(() => console.log("Latest quantity:", this.quantity()));

  onQuantitySelected(qty: number) {
    this.quantity.set(qty);

    // Does not "emit" values, rather updates the value in the "box"
    // this.quantity.set(5);
    // this.quantity.set(42);

    // Add the vehicle to the array again ... to see the effect execute
    //this.vehicles.mutate(v => v.push(this.selectedVehicle()))
  }

}

export interface Vehicle {
  id: number;
  name: string;
  price: number;
}

bootstrapApplication(App);
