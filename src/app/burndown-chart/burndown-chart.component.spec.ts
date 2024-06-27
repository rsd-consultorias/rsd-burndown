import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurndownChartComponent } from './burndown-chart.component';

describe('BurndownChartComponent', () => {
  let component: BurndownChartComponent;
  let fixture: ComponentFixture<BurndownChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BurndownChartComponent]
    });
    fixture = TestBed.createComponent(BurndownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
