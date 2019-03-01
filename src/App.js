import React, { Component } from 'react';
import './App.css';
import UploadFile from './components/UploadFile';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import { socket } from './socket/openSocket';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

registerPlugin(FilePondPluginFileEncode, FilePondPluginImagePreview);

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
        {/* <hr style={{marginTop: 50}} />
        <h3>FilePond</h3>
        <FilePond className='temp' name='file' allowMultiple={true} server='http://192.168.0.175:3000/upload' /> */}
      </div>
    );
  }
}

export default App;
