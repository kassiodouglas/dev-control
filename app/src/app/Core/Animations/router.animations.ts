import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const routerAnimations = trigger('routerAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateY(80%)', opacity: 1 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0%)', opacity: 0 }))
      ], { optional: true })
    ])
  ])
]);
