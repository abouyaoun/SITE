const SessionManager = {

    setAuth(user){
        localStorage.setItem('user', JSON.stringify(user))
    },

    setMouvements(mouvements){
        localStorage.setItem('mouvements', JSON.stringify(mouvements))
    },

    setPortefeuille(portefeuille){
        localStorage.setItem('portefeuille', JSON.stringify(portefeuille))
    },

    setBudget(budget){
        let user = this.getUser()
        localStorage.setItem(user.budget, budget)
    },

    getMouvements() {
        return JSON.parse(localStorage.getItem('mouvements'))
    },

    getPortefeuille() {
        return JSON.parse(localStorage.getItem('portefeuille'))
    },

    getUser() {
        return JSON.parse(localStorage.getItem('user'))
    },

    getAuth() {
        let user = this.getUser()
        if(user){
            return true
        }
        else {
            return false
        }
    },

    getId(){
        let user = this.getUser()
        return user.id
    }

};

export default SessionManager;