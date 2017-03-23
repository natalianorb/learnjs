require('./css/layout.css');
require('./css/filter.css');
require('./css/friend.css');

function login() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5900424
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}

function createFriendsDiv(friends) {
    var templateFn = require('../friend-template.hbs');

    return templateFn({
        friends: friends
    });
}

function addFriend(event) {
    let friend;

    if (event.target.classList.contains('friend__add')) {
        friend = event.target.closest('.friend');
        friend.remove();
        selectedFriends.insertBefore(friend, selectedFriends.firstElementChild);
    }
}

function moveBack(event) {
    if (event.target.classList.contains('friend__add')) {
        let friend = event.target.closest('.friend');
        friend.remove();
        filterFrom.insertBefore(friend, filterFrom.firstElementChild);
    }
}

var loadFriends = document.querySelector('#loadFriends');
var filterFrom = document.querySelector('#friends');
var selectedFriends = document.querySelector('#selectedFriends');
var popup = document.querySelector('.filter__popup');
var list = {};

filterFrom.addEventListener('click', addFriend );
selectedFriends.addEventListener('click', moveBack);


loadFriends.addEventListener('click', () => {
    login()
        .then(() => callAPI('friends.get', {v: 5.62, fields: ['photo_100']}))
        .then(result => filterFrom.innerHTML = createFriendsDiv(result.items))
        .then(() => {
            popup.style = "display: flex;";
            popup.querySelector('.filter__close').addEventListener('click', () => popup.style = "display: none;")
        })
        .catch((e) => console.error(e));
});

