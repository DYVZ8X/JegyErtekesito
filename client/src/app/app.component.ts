import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventListComponent } from './event-list/event-list.component';
import { AddEventComponent } from './add-event/add-event.component';
import { CartComponent } from './cart/cart.component';
import { OrderHystoryComponent } from './order-hystory/order-hystory.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    EventDetailComponent,
    EventListComponent,
    AddEventComponent,
    NavbarComponent,
    OrderHystoryComponent,
    CartComponent,
    OrderListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-first-project test';
}
