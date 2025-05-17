import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { AddEventComponent } from './add-event/add-event.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'events', component: EventListComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: 'add-event',component:AddEventComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'user-management', component:UserManagementComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];
