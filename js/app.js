require(['js/passives.js'])

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello world!',
    oils: [
      { name: 'Clear Oil', level: 1 },
      { name: 'Sepia Oil', level: 10 },
      { name: 'Amber Oil', level: 19 },
      { name: 'Verdant Oil', level: 27 },
      { name: 'Teal Oil', level: 36 },
      { name: 'Azure Oil', level: 44 },
      { name: 'Violet Oil', level: 52 },
      { name: 'Crimson Oil', level: 60 },
      { name: 'Black Oil', level: 68 },
      { name: 'Opalescent Oil', level: 73 },
      { name: 'Silver Oil', level: 78 },
      { name: 'Golden Oil', level: 80 }
    ],
    combo: [],
    passive: null
  },
  created: function () {
    _.map(this.oils, function (oil, i) {
      oil.image = `img/${oil.name.toLowerCase().replace(' ', '_')}.png`
      oil.value = 3 ** i
    })
  },
  methods: {
    title: function(oil) {
      return `${oil.name}<br>Drop Level: ${oil.level}`
    },
    addOil: function(oil) {
      if (this.combo.length < 3) {
        this.combo.push(oil)

        if (this.combo.length === 3) {
          const value = _.reduce(this.combo, function(sum, oil) {
            return sum + oil.value
          }, 0)
          this.passive = passives[value]
        }
      }
    },
    removeOil: function(index) {
      this.combo.splice(index, 1)
      this.passive = null
    }
  }
})

$('[data-toggle="tooltip"]').tooltip()
