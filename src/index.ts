import { TCanvas } from './webgl/TCanvas'
import Lenis from '@studio-freight/lenis'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// smooth scrolling
export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const canvas = new TCanvas(document.body)

window.addEventListener('beforeunload', () => {
  canvas.dispose()
})

const target = document.getElementById('section4')
// console.log('offsetTop', target.offsetTop)
// console.log('clientHeight', target.clientHeight)
//
// lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
//   console.log(scroll)
//   console.log(target.offsetTop)
//   console.log(target.offsetHeight)
//
//   if (scroll > target.offsetTop && scroll < target.offsetHeight) {
//     target.style.position = 'fixed'
//   } else {
//   }
//
//   console.log(target.style.transform)
// })

// gsap.to('.section4', {
//   yPercent: 50,
//   scrollTrigger: {
//     trigger: '.section4',
//     pin: true,
//     start: 'top 50',
//     end: 'bottom top',
//     scrub: 0.7,
//     markers: true,
//   },
// })

let sections = gsap.utils.toArray('.section4__item')

let scrollTween = gsap.to(sections, {
  // because in containerAnimation I offset 30%
  xPercent: -100 * (sections.length + 1) + 35 * 0.3,
  ease: 'none', // <-- IMPORTANT!
  scrollTrigger: {
    trigger: '.section4',
    pin: true,
    scrub: 0.2,
    //snap: directionalSnap(1 / (sections.length - 1)),
    end: '+=3000',
  },
})

let scrollTween2 = gsap.to('.works', {
  xPercent: -100,
  ease: 'none', // <-- IMPORTANT!
  scrollTrigger: {
    trigger: '.item1',
    start: 'left 70%',
    containerAnimation: scrollTween,
    scrub: 0.2,
    //snap: directionalSnap(1 / (sections.length - 1)),
  },
})
