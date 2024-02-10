window.botreader = {
    check_user_selection: function(data) {
        const buttons = ['foodCollectBtn', 'woodCollectBtn', 'metalCollectBtn', 'scienceCollectBtn', 'trimpsCollectBtn', 'buildingsCollectBtn']
        const selections = []
        let current_selection = ''
        buttons.forEach(button_name => {
            const button = document.getElementById(button_name)
            if(!button) return false
            
            if(button.classList.contains('workColorOn')) current_selection = button_name

            selections.push(button_name)
        })
        return [selections, current_selection]
    },
    main: function() {
        const data = {}
        [data.selections, data.current_selection] = self.check_user_selection()
        return data
    }
}