import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  private cartService = inject(CartService);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId).subscribe(() => {
      this.loadCart();
    });
  }

  checkout() {
    this.cartService.checkout().subscribe(() => {
      this.loadCart();
      alert('Vásárlás sikeres!');
    });
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }
}
