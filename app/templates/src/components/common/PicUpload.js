/**
 * Created by huotaol on 2017/12/21.
 */
import React from "react";
import {Button, Form, Icon, message, Modal, Upload} from "antd";
import {baseUrl, get} from "@/axios/tools";
const FormItem = Form.Item;

export default class PicUpload extends React.Component {

    static defaultProps = {
        uploadText: '',
        limit: 1,
        limitSize: 2 * 1024,
        defaultList: [],//url list,
        afterUploadClear: true,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: props.defaultList.map((v, index) => ({uid: -index, status: 'done', url: v})),
            uploading: false,
        };
    }

    componentDidMount() {
    }

    setFileList = urls => {
        const list = urls.map((v, index) => ({uid: -index, status: 'done', url: v}));
        this.setState({fileList: list});
    };

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({file, fileList}) => {
        const {limit, limitSize} = this.props;
        if (limit && fileList.length > limit) {
            message.warn(`只能上传${limit}张图片`);
            return;
        }
        const isLt2M = file.size < limitSize * 1024;
        if (!isLt2M) {
            message.error(`图片不能超过${limitSize}k`);
            return;
        }
        this.setState({fileList});
    };


    handleUpload = () => {
        const {fileList} = this.state;
        const {afterUploadClear} = this.props;

        this.setState({
            uploading: true,
        });
        const {upload} = this.props;
        upload(fileList.map(v => v.originFileObj))
            .then(() => {
                if (afterUploadClear) {
                    this.setState({fileList: [], loading: false});
                } else {
                    this.setState({loading: false});
                }
            });
    };

    render() {
        const {previewVisible, previewImage, fileList, uploading} = this.state;
        const {uploadText, limit} = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">{uploadText}</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="do not upload"
                    listType="picture-card"
                    fileList={fileList}
                    disabled={fileList.length >= limit}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    { uploadButton}
                </Upload>
                <Button
                    className="upload-demo-start"
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={this.state.fileList.length === 0}
                    loading={uploading}
                >
                    {uploading ? '上传中...' : '开始上传' }
                </Button>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

