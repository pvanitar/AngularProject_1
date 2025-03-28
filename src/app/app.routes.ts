import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { Component } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { DeviceComponent } from './pages/device/device.component';
import { childAuthGuard } from './Service/child-auth.guard';
import { authGuard } from './Service/auth.guard';

export const routes: Routes = [

    {
        path:'',
        component:LoginComponent,
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component:LayoutComponent,
        canActivateChild:[childAuthGuard],
        children:[
            {
                path:'dashboard',
                component:DashboardComponent,
                canActivate:[authGuard]
            },
            {
                path:'user',
                component:UserComponent,
                canActivate:[authGuard]
            },
            {
                path:'device',
                component:DeviceComponent,
                canActivate:[authGuard]
            }
        ]
    }
];
