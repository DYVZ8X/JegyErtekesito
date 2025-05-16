import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AComponentComponent } from './a-component/a-component.component';
import { BComponentComponent } from './b-component/b-component.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventListComponent } from './event-list/event-list.component';
import { AddEventComponent } from './add-event/add-event.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    AComponentComponent,
    BComponentComponent,
    LoginComponent,
    SignupComponent,
    EventDetailComponent,
    EventListComponent,
    AddEventComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-first-project test';
}
