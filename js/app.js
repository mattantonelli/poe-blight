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
    passives: null,
    search: '',
    myOils: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  created: function () {
    const self = this

    _.map(this.oils, function (oil, i) {
      oil.image = `img/${oil.name.toLowerCase().replace(' ', '_')}.png`
      oil.value = 3 ** i
    })

    $.getJSON('vendor/passives.json', function (passives) {
      self.passives = passives
    })
  },
  methods: {
    title: function(oil) {
      return `${oil.name}<br>Drop Level: ${oil.level}`
    },
    addOil: function(oil) {
      if (this.combo.length < 3) {
        this.combo.push(oil)
      }
    },
    removeOil: function(index) {
      this.combo.splice(index, 1)
    },
  },
  computed: {
    passive: function() {
      if (this.combo.length === 3) {
        const value = _.reduce(this.combo, function(sum, oil) {
          return sum + oil.value
        }, 0)

        return this.passives[value]
      }
    }
  },
  watch: {
    combo: function() {
      $('.oil-select img').tooltip('dispose')
      Vue.nextTick(function () {
        $('.oil-select img').tooltip()
      })
    }
  }
})

Vue.component('passives-table', {
  props: ['passives', 'search', 'myOils'],
  template: '#passives-table',
  methods: {
    setCombo: function(value) {
      var combo = []

      while (value > 0) {
        const oil = _.maxBy(this.$parent.oils, function(oil) {
          if (value - oil.value > 0) {
            return oil.value
          } else if (value - oil.value === 0 && combo.length === 2) {
            return oil.value
          }
        })

        combo.push(oil)
        value -= oil.value
      }

      this.$parent.combo = combo
    }
  },
  computed: {
    searchResults: function() {
      const search = this.search.toLowerCase()
      const oils = _.map(this.myOils, function(x) { return parseInt(x) })
      const oilCount = _.sum(oils)
      var results = this.passives

      if (search !== '') {
        results = _.pickBy(results, function(passive) {
          return passive.name.toLowerCase().indexOf(search) > -1 ||
            passive.description.toLowerCase().indexOf(search) > -1
        })
      }

      if (oilCount > 0 && oilCount < 3) {
        results = {}
      } else if (oilCount >= 3) {
        if (_.sum(oils) > 2) {
          results = _.pickBy(results, function(passive, value) {
            const usableOils = oils.slice(0, Math.ceil(Math.cbrt(value)))
            var totalUsed = 0

            for (i = usableOils.length - 1; i > -1; i--) {
              const oilValue = 3 ** i
              for (q = usableOils[i]; q > 0 && (value > oilValue || value === oilValue && totalUsed >= 2); q--) {
                value -= oilValue
                totalUsed += 1
              }
            }

            return value === 0
          })
        }
      }

      return results
    }
  }
})

$('[data-toggle="tooltip"]').tooltip()
