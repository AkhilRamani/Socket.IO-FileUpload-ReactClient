import openSocket from 'socket.io-client';

export const socket = openSocket('http://192.168.0.175:3000/');