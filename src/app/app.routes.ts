import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { Component } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
        children:[
            {
                path:'dashboard',
                component:DashboardComponent
            }
        ]
    }
];
