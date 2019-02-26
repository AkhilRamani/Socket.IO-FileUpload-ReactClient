import React,{ Component } from 'react';
import { Upload, Icon, Modal } from 'antd';

class AntdUpload extends Component{

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
      };
    
      handleCancel = () => this.setState({ previewVisible: false })
    
      handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    
      handleChange = ({ fileList }) => {
        this.setState({ fileList })
      }
    
      render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        return (
          <div className="clearfix">
            <Upload
              action="http://192.168.0.175:3000/upload"
              listType="picture-card"
              
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              { uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        );
      }
}

export default AntdUpload;