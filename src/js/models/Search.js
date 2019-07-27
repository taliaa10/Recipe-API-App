import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/'
        const key = 'bb41434df2446a529a4db93d3c1de9f7'
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.result = res.data.recipes
            // console.log(this.result)
        } catch (error) {
            alert(error)
        } 
    }
}

