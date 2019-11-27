import { define } from '../utils/object'

export default function (Glide, Components, Events) {
  const Loop = {
    mount () {
      if (Glide.settings.loop) {
        if (Glide.index < Glide.settings.perView) {
          this.setEndSlides()
        } else if (Glide.index > Components.Run.length - Glide.settings.perView) {
          this.setStartSlides()
        }
      }
    },

    setEndSlides() {
      let { slideWidth } = Components.Sizes

      this.slidesEnd.forEach((slide, i) => {
        slide.style.left = `-${(slideWidth * (i + 1)) + (Components.Gaps.value * (i + 1))}px`
      })
    },

    setStartSlides() {
      let { slideWidth } = Components.Sizes

      this.slidesStart.forEach((slide, i) => {
        slide.style.left = `${((slideWidth * (i + 1)) + (slideWidth * Components.Run.length)) + ((Components.Gaps.value * (i + 1)) + (Components.Run.length * Components.Gaps.value))}px`
      })
    },
  }

  define(Loop, 'number', {
    get () {
      let { focusAt, perView } = Glide.settings

      if (focusAt === 'center') {
        return perView + Math.floor(perView / 2)
      }

      return perView + (perView - (focusAt + 1))
    }
  })

  define(Loop, 'slidesEnd', {
    get () {
      return Components.Html.slides.slice(`-${Loop.number}`).reverse()
    }
  })

  define(Loop, 'slidesStart', {
    get () {
      return Components.Html.slides.slice(0, Loop.number)
    }
  })

  Events.on('run.start', (move) => {
    Loop.setEndSlides()
  })

  Events.on('run.end', (move) => {
    Loop.setStartSlides()
  })

  Events.on('run.offset', (move) => {
    // Components.Build.positioning()

    if (move.direction === '<') {
      Loop.setStartSlides()
    }

    if (move.direction === '>') {
      Loop.setEndSlides()
    }
  })

  return Loop
}
