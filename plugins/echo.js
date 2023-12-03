import Echo from "laravel-echo"

window.Pusher = require('pusher-js');

/*import Vue from 'vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;*/
export default function ({ $echo, $auth, $config }) {
  let token = $auth.strategy.token.get();
  //console.log(token)
  const options = {
    authEndpoint: $config.apiUrl+'/broadcasting/auth',
    auth: {
      headers: {
        Authorization:  token,
      }
    },
    broadcaster: 'pusher',
    key: 'local',
    wsHost: $config.wsHost,
    wsPort: $config.wsPort,
    wssPort: $config.wsPort,
    forceTLS: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    /*broadcaster: 'pusher',
    wsHost: '127.0.0.1',
    key: 'local',
    //cluster: $config.wsCluster,
    encrypted: true,
    enableLogging: true,
    connectOnLogin: true,
    disconnectOnLogout: false,
    wsPort: 6001,
    //wssPort: $config.wsPort,
    //forceTLS: $config.wsTLS,
    disableStats: true,
    authModule: true*/
  }
  window.Echo = new Echo(options);
}
