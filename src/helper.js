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