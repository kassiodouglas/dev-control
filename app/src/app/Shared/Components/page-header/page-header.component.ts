import { Component, Input, OnInit, OnDestroy } from '@angular/core'; // Added OnInit, OnDestroy
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcumb/breadcrumb.component';
import { ActivatedRoute, NavigationEnd, Router, Data } from '@angular/router'; // Added ActivatedRoute, NavigationEnd, Router, Data
import { filter, map, Subscription } from 'rxjs'; // Added filter, map, Subscription

@Component({
  selector: 'comp-page-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="bg-white dark:bg-zinc-900 dark:text-white p-4 shadow-md mb-4 max-h-[88px]">
      <comp-breadcrumb [items]="breadcrumbs"></comp-breadcrumb>
      <h1 class="text-2xl font-bold text-gray-800 mt-2 dark:text-white ">{{ title }}</h1>
      <p *ngIf="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>
  `,
})
export class PageHeaderComponent implements OnInit, OnDestroy { // Implemented OnInit, OnDestroy
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() breadcrumbs: BreadcrumbItem[] = [];

  private routerSubscription!: Subscription; // Subscription to manage router events

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {} // Injected Router and ActivatedRoute

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getChild(this.activatedRoute)),
      filter((route) => route.outlet === 'primary'),
      map((route) => route.snapshot.data)
    ).subscribe((data: Data) => {
      this.title = data['title'] || 'Título Padrão'; // Default title
      this.subtitle = data['subtitle'] || ''; // Default subtitle
      // You can also build breadcrumbs here based on route snapshot if needed
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
