import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BurndownChartComponent } from './burndown-chart/burndown-chart.component';

const routes: Routes = [
  { path: '**', component: BurndownChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
