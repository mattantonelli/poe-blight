const app = new Vue({
  el: '#app',
  data: {
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
    type: 'amulet',
    passives: {},
    enchantments: {},
    towers: {},
    maps: {},
    search: '',
    myOils: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  created: function () {
    const self = this

    _.map(this.oils, function (oil, i) {
      oil.image = `img/oils/${oil.name.toLowerCase().replace(' ', '_')}.png`
      oil.value = 3 ** i
    })

    _.each(['passives', 'enchantments', 'maps'], function(type) {
      $.getJSON(`vendor/${type}.json`, function (data) {
        _.each(data, function(value, key) {
          data[key]['value'] = parseInt(key)
        })

        self[type] = data
      })
    })

    $.getJSON('vendor/towers.json', function (towers) {
      self.towers = towers
      Vue.nextTick(function() {
        $('.tower-select img').tooltip()
      })
    })
  },
  methods: {
    addOil: function(oil) {
      if (this.combo.length < this.maxOils) {
        this.combo.push(oil)
      }
    },
    removeOil: function(index) {
      this.combo.splice(index, 1)
    },
    setType: function(type) {
      if (type === 'ring') {
        this.combo = this.combo.slice(0, 2)
      }
      this.type = type
      this.search = ''
    }
  },
  computed: {
    anointment: function() {
      if (this.combo.length > 0 && this.type === 'map') {
        const anointments = this.anointments
        var mods = {}

        _.each(this.combo, function(oil) {
          const anointment = anointments[oil.value]
          if (mods[anointment.description]) {
            mods[anointment.description] += anointment.mod
          } else {
            mods[anointment.description] = anointment.mod
          }
        })

        const packSize = 'MOD% Monster pack size'
        if (mods[packSize]) {
          const size = mods[packSize]
          delete mods[packSize]
          mods[packSize] = size + this.combo.length * 5
        } else {
          mods[packSize] = this.combo.length * 5
        }

        const description = _.map(mods, function(value, mod) {
          return `${mod.replace('MOD', value)}`
        })

        return { "description": _.join(description, '<br>') }
      } else if (this.combo.length === this.maxOils) {
        const value = _.reduce(this.combo, function(sum, oil) {
          return sum + oil.value
        }, 0)

        return this.anointments[value]
      }
    },
    anointments: function() {
      if (this.type === 'amulet') {
        return this.passives
      } else if (this.type === 'ring') {
        return this.enchantments
      } else if (this.type === 'map') {
        return this.maps
      }
    },
    maxOils: function() {
      if (this.type === 'ring') {
        return 2
      } else {
        return 3
      }
    }
  },
  watch: {
    combo: function() {
      $('.oil-select img').tooltip('dispose')
      Vue.nextTick(function() {
        $('.oil-select img').tooltip()
      })
    }
  }
})

Vue.component('anointments-table', {
  props: ['anointments', 'type', 'search', 'myOils'],
  data: function() {
    return { sortKey: null, sortOrder: 'asc' }
  },
  template: '#anointments-table',
  methods: {
    setCombo: function(value) {
      value = parseInt(value)

      if (this.type === 'map') {
        const oil = _.find(this.$parent.oils, function(oil) {
          return oil.value === value
        })

        this.$parent.addOil(oil)
      } else {
        var combo = []
        const maxOils = this.$parent.maxOils

        while (value > 0) {
          const oil = _.maxBy(this.$parent.oils, function(oil) {
            if (value - oil.value > 0 || (value - oil.value === 0 && (combo.length === maxOils - 1))) {
              return oil.value
            }
          })

          combo.push(oil)
          value -= oil.value
        }

        this.$parent.combo = combo
      }
    },
    formatDescription: function(anointment) {
      if (this.type === 'map') {
        if (anointment.value === 27 || anointment.value === 19683) {
          return anointment.description.replace('MOD', anointment.mod + 5)
        } else {
          return `${anointment.description.replace('MOD', anointment.mod)}<br>+5% Monster pack size`
        }
      } else {
        return anointment.description
      }
    },
    sortBy: function(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortOrder = 'asc'
      }

      this.sortKey = key
    },
    sortHeader: function(key) {
      if (this.sortKey === key.toLowerCase()) {
        return `<u>${key}</u>${this.sortOrder === 'asc' ? "\u23F7" : "\u23F6"}`
      } else {
        return `<u>${key}</u>`
      }
    }
  },
  computed: {
    searchResults: function() {
      const search = this.search.toLowerCase()
      const oils = _.map(this.myOils, function(x) { return parseInt(x) })
      const oilCount = _.sum(oils)
      const maxOils = this.type === 'map' ? 1 : this.$parent.maxOils
      const type = this.type
      var results = this.anointments

      if (search !== '') {
        results = _.pickBy(results, function(anointment) {
          return anointment.name.toLowerCase().indexOf(search) > -1 ||
            anointment.description.toLowerCase().indexOf(search) > -1
        })
      }

      if (oilCount > 0 && oilCount < maxOils) {
        results = {}
      } else if (oilCount >= maxOils) {
        results = _.pickBy(results, function(anointment) {
          var value = anointment.value
          var totalUsed = 0

          for (i = oils.length - 1; i > -1; i--) {
            const oilValue = 3 ** i
            for (q = oils[i]; q > 0 && (value > oilValue || value === oilValue && totalUsed >= maxOils - 1); q--) {
              value -= oilValue
              totalUsed += 1
            }
          }

          return value == 0
        })
      }

      if (this.sortKey !== null) {
        const key = this.sortKey
        results = _.sortBy(_.values(results), function(result) { return result[key] })
        if (this.sortOrder === 'desc') {
          results = _.reverse(results)
        }
      }

      return results
    }
  }
})

$('[data-toggle="tooltip"]').tooltip()
