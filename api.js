//Required Axios to retrieve data from the api and dynamically generate to 
const axios = require("axios");
//configures the exact information we are getting from the api 
require("dotenv").config();
//retrieves github profile information 
const api = {
    getUser(username) {
        return axios 
        .get(`https://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
        )
        .catch(err => {
        console.log(`User not found`);
        process.exit(1);
  });
},
//retrieves github stars from browser
getTotalStars(username) {
        return axios
        .get(`https://api.github.com/users/${username}/repos?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&per_page=100`
        )
            .then(response => {
                    // After getting user, count all their repository stars
            console.log(response.data)
                return response.data.reduce((acc, curr) => {
             acc += curr.stargazers_count;
        return acc;
    }, 0);
  });
}
};

module.exports = api;

