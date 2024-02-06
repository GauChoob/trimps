// don't forget to add jquery
// https://code.jquery.com/jquery-3.7.1.min.js

// thingColorCanNotAfford
// thingColorCanAfford
window.bot = {
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
    search_purchase: function(purchase_name) {
        obj = $(`#${purchase_name}`)
        if(obj.length === 0) return false

        ret = {}
        ret.affordable = obj.hasClass('thingColorCanAfford')

        return ret
    },

    check_storage: function() {
        let storage_data = {
            food: {building: 'Barn'},
            wood: {building: 'Shed'},
            metal: {building: 'Forge'},
        }
        Object.entries(storage_data).forEach(([k, v]) => {
            purchase = this.search_purchase(v.building)
            if(!purchase) return // Barn/Shed/Forge not found
            affordable = purchase.affordable
            resource = this.get_resource(k)
            time_to_max = this.readTime($(`#${k}TimeToFill`).text())
            // Buy to get 8 hours of storage if planning for overnight
            if(window.botparam.storage_night) {
                if(affordable && time_to_max < 8*3600) {
                    console.log(`Request ${v.building}`)
                    $(`#${v.building}`).click()
                }
            }
            // Buy before hitting cap
            if(resource.owned/resource.max > 0.8) {
                console.log(`Request ${v.building}`)
                $(`#${v.building}`).click()
            }
        })


    },
    bot_loop: function() {
        if(!window.bot_activated) return
        try {
            numTab(1) // Select +1
    
            console.log('BotLoop')
            this.check_storage()
            setTimeout(function() {window.bot.bot_loop()}.bind(window.bot), 1000)
        } catch(err) {
            this.disable()
            throw err
        }
    },
}

window.bot.enable()