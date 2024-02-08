window.botparam = {
    house_weight: 1,
    storage_night: false,
    gem_value: 5,
}


window.bothelper = {
    readTime: function(duration) {
        if(!duration) return 365*24*3600 // No value = infinity sometimes

        reg_year = /Year/g
        reg_day = /(\d*) Day/g
        reg_hour = /(\d*) Hour/g
        reg_min = /(\d*) Min/g
        reg_sec = /(\d*) Sec/g

        day = reg_day.exec(duration)
        hour = reg_hour.exec(duration)
        min = reg_min.exec(duration)
        sec = reg_sec.exec(duration)

        time = 0

        if(duration.includes('Year')) time += 365*24*3600
        if(duration.includes('Long Time')) time += 365*24*3600
        if(day) time += parseInt(day[1])*24*3600
        if(hour) time += parseInt(hour[1])*3600
        if(min) time += parseInt(min[1])*60
        if(sec) time += parseInt(sec[1])

        return time
    },

}



//#turkimpBuff

window.bot = {
    enable: function() {
        if(!window.bot_activated) {
            window.bot_activated = true
            this.bot_loop()
        }
    },
    disable: function() {
        window.bot_activated = false
    },

    get_resource: function(resource_name) {
        return window.game.resources[resource_name]
    },
    search_storage: function(purchase_name) {
        obj = document.getElementById(purchase_name)
        if(!obj) return false

        ret = {}
        ret.affordable = obj.classList.contains('thingColorCanAfford')

        return ret
    },
    get_building: function(name) {
        return window.game.buildings[name]
    },
    get_thing_cost: function(costs, purchased) {
        const ret = {}
        Object.entries(costs).forEach(([name,cost]) => {
            if(cost instanceof Function) ret[name] = cost()
            else if(isNaN(cost)) ret[name] = cost[0]*cost[1]**purchased
            else ret[name] = cost
        })
        return ret
    },
    search_house: function(purchase_name) {
        obj = document.getElementById(purchase_name)
        if(!obj) return false

        ret = {}
        ret.name = purchase_name
        ret.affordable = obj.classList.contains('thingColorCanAfford')
        building = this.get_building(purchase_name)
        ret.cost = this.get_thing_cost(building.cost, building.purchased)
        ret.housing = building.increase.by
        ret.estimated_total_cost = (ret.cost.food ?? 0) + (ret.cost.wood ?? 0) + (ret.cost.metal ?? 0) + window.botparam.gem_value*(ret.cost.gems ?? 0)
        ret.resources_per_housing = ret.estimated_total_cost/ret.housing
        return ret
    },

    buy_storage: function() {
        const storage_data = {
            food: {building: 'Barn'},
            wood: {building: 'Shed'},
            metal: {building: 'Forge'},
        }
        Object.entries(storage_data).forEach(([k, v]) => {
            purchase = this.search_storage(v.building)
            if(!purchase) return // Barn/Shed/Forge not found
            affordable = purchase.affordable
            resource = this.get_resource(k)
            time_to_max = window.bothelper.readTime(document.getElementById(`${k}TimeToFill`).textcontent)
            // Buy to get 8 hours of storage if planning for overnight
            if(window.botparam.storage_night) {
                if(affordable && time_to_max < 8*3600) {
                    console.log(`Click ${v.building}`)
                    document.getElementById(v.building).click()
                }
            }
            // Buy before hitting cap
            if(resource.owned/resource.max > 0.8) {
                console.log(`Click ${v.building}`)
                document.getElementById(v.building).click()
            }
        })
    },

    check_housing: function(){
        const house_names = ['Hut', 'House', 'Mansion', 'Hotel']
        let houses = []
        house_names.map(name => {
            house = this.search_house(name)
            if(house) houses.push(house)
        })
        houses.sort((a, b) => a.resources_per_housing - b.resources_per_housing)
        houses.map(house => {
            console.log(`${house.name}: ${Math.log10(house.resources_per_housing)}`)
        })
    },

    buy_upgrades: function(){
        const upgrade_names = ['Axeidic', 'Battle', 'Bestplate', 'Blockmaster', 'Bloodlust', 'Bootboost', 'Bounty', 'Coordination', 'Dagadder', 'Efficiency', 'Egg', 'Explorers', 'Greatersword', 'Gymystic', 'Hellishment', 'Megamace', 'Miners', 'Pantastic', 'Polierarm', 'Potency', 'Scientists', 'Smoldershoulder', 'Speedfarming', 'Speedlumber', 'Speedminer', 'Speedscience', 'Supershield', 'TrainTacular', 'Trainers', 'Trapstorm', 'UberHut']
        const upgrades = document.getElementById('upgradesHere').children
        for(const upgrade of upgrades) {
            if(!upgrade_names.includes(upgrade.id)) return
            if(!upgrade.classList.contains('thingColorCanAfford')) return
            console.log(`Click ${upgrade.id}`)
            upgrade.click()

        }
    },

    bot_loop: function() {
        if(!window.bot_activated) return
        try {
            numTab(1) // Select +1
    
            console.log('BotLoop')
            this.buy_storage()
            //this.check_housing()
            this.buy_upgrades()
            setTimeout(function() {window.bot.bot_loop()}.bind(window.bot), 1000)
        } catch(err) {
            this.disable()
            throw err
        }
    },
}

window.bot.enable()


