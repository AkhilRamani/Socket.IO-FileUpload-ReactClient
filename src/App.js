import React, { Component } from 'react';
import './App.css';
import UploadFile from './components/UploadFile';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import AntdUpload from './components/antdUpload';
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
      <div className="App">
        <UploadFile />
        <hr style={{marginTop: 50}} />
        <h3>FilePond</h3>
        <FilePond className='temp' name='file' allowMultiple={true} server='http://192.168.0.175:3000/upload' />
        <hr style={{marginTop: 50}} />
        <h3>ANT Design</h3>
        <AntdUpload className='temp' />
      </div>
    );
  }
}

export default App;
