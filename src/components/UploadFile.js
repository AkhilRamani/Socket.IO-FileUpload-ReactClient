import React,{ Component} from 'react';
import { socket } from '../socket/openSocket';
import { message } from 'antd';

class UploadFile extends Component{
    state = {
        selectedFile: null, loaded: 0, pauseUpload: false, allFiles: null, totalRemainingFiles: null
    }
    fReader = new FileReader();
    count = 1;
    constructor(props){
        super(props);

        socket.on('MORE_DATA', (data) => {
            this.state.pauseUpload && this.sendMoreData(data);
        })

        socket.on('DONE', (data) => {
            if(this.state.totalRemainingFiles > 0){
                message.info(`${this.count} uploaded`);
                this.setState((state)=> ({selectedFile: state.allFiles[this.count], totalRemainingFiles: --state.totalRemainingFiles, loaded:0}));
                this.handleSocketUpload();
                ++this.count;
            }       
        })
    }
    
    sendMoreData = (data) => {
        console.log('progress ', `${data.percent}%`);
        this.setState({ loaded: data.percent });
        let place = data.place * 524288;
        let newFile = this.state.selectedFile.slice(place, place + Math.min(524288, (this.state.selectedFile.size - place)));
        this.fReader.readAsBinaryString(newFile);
    }

    handleSelectedFile = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
            allFiles: event.target.files,
            totalRemainingFiles: event.target.files.length
        })
        this.count = 1;
    }

    handleSocketUpload = () => {
        if(this.state.selectedFile){
            let name = this.state.selectedFile.name;
            this.fReader.onload = (event) => {
                socket.emit('UPLOAD', { name, data: event.target.result})
            }
            socket.emit('START', { name, size: this.state.selectedFile.size });
            this.setState({pauseUpload: true});
        } else{
            if(!this.state.allFiles) return message.warning('Please select file first');
            this.setState({ pauseUpload: false, loaded: 100});
            message.success('All Files Uploaded Successfully');
        }
    }

    handlePause = () =>{
        console.log('pause')
        this.setState({ pauseUpload: false});
    }

    render(){
        return(
            <>
                <input type='file' name='file' id='' onChange={this.handleSelectedFile} multiple />
                <button onClick={!this.state.pauseUpload ? this.handleSocketUpload : this.handlePause}>{this.state.pauseUpload ? 'Pause' : 'Upload'}</button>
                <h3>{Math.round(this.state.loaded, 2)} %</h3>
            </>
        );
    }
}

export default UploadFile;