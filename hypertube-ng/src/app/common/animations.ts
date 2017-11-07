import {animate, state, style, transition, trigger} from '@angular/animations';

export let fade = trigger('fade', [
  state('void', style({opacity: 0})),
  transition(':enter', [
    animate(300)
  ])
]);

export let expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden'
  })),

  transition('collapsed => expanded', [
    animate('200ms')
  ]),

  transition('expanded => collapsed', [
    animate('200ms')
  ])

]);
