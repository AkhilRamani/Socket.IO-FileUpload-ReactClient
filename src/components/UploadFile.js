import React,{ Component} from 'react';
import { socket } from '../socket/openSocket';
import { message } from 'antd';

class UploadFile extends Component{
    state = {
        selectedFile: null, loaded: 0, buttonName: false
    }
    fReader = new FileReader();

    constructor(props){
        super(props);
        // socket.on('MORE_DATA', (data) => {
        //     console.log('progress ', `${data.percent}%`);
        //     this.setState({ loaded: data.percent });
        //     let place = data.place * 524288;
        //     let newFile = this.state.selectedFile.slice(place, place + Math.min(524288, (this.state.selectedFile.size - place)));
        //     this.state.buttonName && this.fReader.readAsBinaryString(newFile);
        // })

        socket.on('MORE_DATA', (data) => {
            this.state.buttonName && this.sendMoreData(data);
        })

        socket.on('DONE', (data) => {
            console.log('progress 100%');
            this.setState({ loaded: 100 });
            message.success('Upload Successfull');
            this.setState({ buttonName: false});
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
            loaded: 0
        })

        console.log(event.target.files.length);
    }

    handleSocketUpload = () => {
        let name = this.state.selectedFile.name;
        console.log('selected file - ', name);
        this.fReader.onload = (event) => {
            socket.emit('UPLOAD', { name, data: event.target.result})
        }
        socket.emit('START', { name, size: this.state.selectedFile.size });
        this.setState({buttonName: true});
    }

    handlePause = () =>{
        console.log('pause')
        this.setState({ buttonName: false});
    }

    render(){
        return(
            <>
                <input type='file' name='file' id='' onChange={this.handleSelectedFile} multiple />
                <button onClick={!this.state.buttonName ? this.handleSocketUpload : this.handlePause}>{this.state.buttonName ? 'Pause' : 'Upload'}</button>
                <h3>{Math.round(this.state.loaded, 2)} %</h3>
            </>
        );
    }
}

export default UploadFile;