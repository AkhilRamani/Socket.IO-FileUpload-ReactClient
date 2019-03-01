import React, { Component } from 'react';
import './App.css';
import UploadFile from './components/UploadFile';
import { socket } from './socket/openSocket';

class App extends Component {

  constructor(props){
    super(props);
    socket.on('connect', ()=>{
      console.log('connected to server');
    })
  }

  render() {
    return (
      <div className="App" style={{paddingTop: 40}}>
        <div style={{width: 300}}>
            <UploadFile 
                onPause={()=> console.log('onPause Worked')}
                onComplete={()=> console.log('onComplete called')}
                onResume={()=> console.log('onResume called')}
                onCancel={()=> console.log('onCancel called')}
                multiple
            />
        </div>
      </div>
    );
  }
}

export default App;
