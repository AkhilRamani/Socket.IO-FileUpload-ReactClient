import React,{ Component} from 'react';
import { socket } from '../socket/openSocket';
import './inputFile.css';
import ProgressBar from './progressBar';
import UploadBtn from './elements/UploadBtn';


class UploadFile extends Component{
    state = {
        selectedFile: null, loaded: 0, pauseUpload: false, allFiles: null, totalRemainingFiles: null, fileInputText: null, resume: false
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
                //message.info(`${this.count} uploaded`);
                this.setState((state)=> ({selectedFile: state.allFiles[this.count], totalRemainingFiles: --state.totalRemainingFiles, loaded:0}));
                this.handleSocketUpload();
                ++this.count;
                !this.state.totalRemainingFiles && this.props.onComplete();
            }      
        })
    }
    
    sendMoreData = (data) => {
        //console.log('progress ', `${data.percent}%`);
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
            totalRemainingFiles: event.target.files.length,
            fileInputText: `${event.target.files.length} Files Selected`
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
            if(!this.state.allFiles) return null;
            this.setState({ pauseUpload: false, loaded: 100, totalRemainingFiles: null, resume: false});
            //message.success('All Files Uploaded Successfully');
        }
    }
    
    handlePause = () =>{
        this.setState({ pauseUpload: false });
        this.props.onPause();
    }
    
    handleClick = () => {
        this.state.resume && this.props.onResume();
        this.handleSocketUpload();
        this.setState({resume: true})
    }

    render(){
        return(
            <><div id='hide' style={{maxWidth: '100%', border: "1px dashed rgb(148, 198, 241)", padding: 20, borderRadius:15, margin:'0 auto' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                    <input type='file' name='file' id='fileInput' onChange={this.handleSelectedFile} multiple={this.props.multiple && 'multiple'} />
                    <label className='input-text' style={{fontSize: 15
                                                    }} htmlFor="fileInput">{this.state.fileInputText || 'Select Files'}</label>
                    <UploadBtn pauseUpload={this.state.pauseUpload} onClick={!this.state.pauseUpload ? this.handleClick : this.handlePause} />      
                </div>
                <ProgressBar percent={Math.round(this.state.loaded, 2)} />
            </div>
            </>
        );
    }
}

export default UploadFile;