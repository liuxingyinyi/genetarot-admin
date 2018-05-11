/**
 * Created by huotaol on 2017/12/21.
 */
import React from "react";
import {Button, Form, Icon, message, Modal, Upload} from "antd";

const FormItem = Form.Item;
const LIMIT_SIZE = 700 * 1024;

class PicUpload extends React.Component {

    static defaultProps = {
        limitSize: LIMIT_SIZE,
        limit: 10,
        defaultFileList: [],
        callRef: () => {
        },
    };
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: props.defaultFileList,
            disabled: false
        };
    }

    componentDidMount() {
        this.props.callRef(this);
    }

    setFileList = list => {
        this.setState({fileList: list, disabled: false});
    };


    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({fileList}) => {
        const {limit} = this.props;
        if (fileList.length > limit) {
            message.error(`当前只能上传${limit}张图片`);
            return;
        }
        fileList = fileList.filter(v => {
            const {limitSize} = this.props;
            const suit = v.status !== 'uploading' || v.originFileObj.size <= limitSize;
            if (!suit) {
                message.error(`图片大小不能超过${limitSize}`);
            }
            return suit;
        });
        const disabled = fileList.length >= limit;
        this.setState({fileList, disabled});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const postData = {file: this.state.fileList.map(v => v.originFileObj)};
                this.props.upload(postData)
                    .then(data => {
                        this.setState({fileList: []});
                    });
            }
        });
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div >
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action='doesnotupload'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    disabled={this.state.disabled}
                    onChange={this.handleChange}
                >
                    {uploadButton}
                </Upload>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        <Button htmlType="submit" className="login-form-button"
                        >
                            上传图片
                        </Button>
                    </FormItem>
                </Form>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}


export default Form.create()(PicUpload);