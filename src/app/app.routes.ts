import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServiceComponent } from './components/service/service.component';
import { ProcessComponent } from './components/process/process.component';
import { CommentComponent } from './components/comment/comment.component';
import { ReferanceComponent } from './components/referance/referance.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { InformationComponent } from './components/information/information.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { ContactComponent } from './components/contact/contact.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProductComponent } from './components/product/product.component';
import { AdvertComponent } from './components/advert/advert.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "",
        component: LayoutComponent,
        canActivateChild: [() => inject(AuthService).isAuthenticated()],
        children:[
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "about",
                component: AboutComponent
            },
            {
                path: "service",
                component: ServiceComponent
            },
            {
                path: "process",
                component: ProcessComponent
            },
            {
                path: "comment",
                component: CommentComponent
            },
            {
                path: "referance",
                component: ReferanceComponent
            },
            {
                path: "information",
                component: InformationComponent
            },
            {
                path: "gallery",
                component: GalleryComponent
            },
            {
                path: "information",
                component: InformationComponent
            },
            {
                path: "contact",
                component: ContactComponent
            },
            {
                path: "settings",
                component: SettingsComponent
            },
            {
                path: "product",
                component: ProductComponent
            },
            {
                path: "advert",
                component: AdvertComponent
            }
        ]
    }
];
