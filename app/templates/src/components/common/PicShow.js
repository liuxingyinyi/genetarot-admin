/**
 * Created by huotaol on 2017/12/21.
 */
import React from "react";
import {Card, Col, Icon, Modal, Popconfirm, Row} from "antd";
import PicEditor from "./PicEditor";
import PhotoSwipe from "photoswipe";
import PhotoswipeUIDefault from "photoswipe/dist/photoswipe-ui-default";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import {connect} from "react-redux";

const {Meta} = Card;
const confirm = Modal.confirm;

class PicShow extends React.Component {
    static defaultProps = {
        editAble: true,
    };
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showPicEditor: false,
            editData: null
        };
    }

    componentWillUnmount = () => {
        this.closeGallery();
    };

    openGallery = (item) => {
        const items = [
            {
                src: item,
                w: 0,
                h: 0,
            }
        ];
        const pswpElement = this.pswpElement;
        const options = {index: 0};
        this.gallery = new PhotoSwipe(pswpElement, PhotoswipeUIDefault, items, options);
        this.gallery.listen('gettingData', (index, item) => {
            const _this = this;
            if (item.w < 1 || item.h < 1) { // unknown size
                const img = new Image();
                img.onload = function () { // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    _this.gallery.invalidateCurrItems(); // reinit Items
                    _this.gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        this.gallery.init();
    };

    closeGallery = () => {
        if (!this.gallery) return;
        this.gallery.close();
    };

    _getItem = data => {
        const {picPrefix} = this.props;
        return <Col span={6}>
            <Card
                hoverable
                actions={[<Icon type="eye-o" onClick={e => {
                    this.openGallery(data.url);
                }}/>, <Icon type="edit" onClick={e => {
                    if (!this.state.editData) {
                        return;
                    }
                    this.setState({editData: data, showPicEditor: true});
                }}/>, <Popconfirm title="删除图片" onConfirm={() => {
                    this.props.deletePic(data);
                }}>
                    <Icon type="delete"/></Popconfirm>]}
                cover={<img alt="example" src={picPrefix + data.url}/>}
            >
                <Meta
                    title={data.name}
                    description={data.description}
                />
            </Card>
        </Col>

    };

    render() {
        const {imageList} = this.props;
        return (
            <div>
                <Row gutter={16} type="flex" justify="left">
                    {imageList.map(v => this._getItem(v))}
                </Row>
                <PicEditor visible={this.state.showPicEditor} data={this.state.editData} onCancel={() => {
                    this.setState({showPicEditor: false, editData: null});
                }}/>
                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true" ref={(div) => {
                    this.pswpElement = div;
                } }>

                    <div className="pswp__bg"/>

                    <div className="pswp__scroll-wrap">

                        <div className="pswp__container">
                            <div className="pswp__item"/>
                            <div className="pswp__item"/>
                            <div className="pswp__item"/>
                        </div>

                        <div className="pswp__ui pswp__ui--hidden">

                            <div className="pswp__top-bar">

                                <div className="pswp__counter"/>

                                <button className="pswp__button pswp__button--close" title="Close (Esc)"/>

                                <button className="pswp__button pswp__button--share" title="Share"/>

                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"/>

                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out"/>

                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                <div className="pswp__share-tooltip"/>
                            </div>

                            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"/>

                            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)"/>

                            <div className="pswp__caption">
                                <div className="pswp__caption__center"/>
                            </div>

                        </div>

                    </div>

                </div>
                <style>{`
                    .ant-card-body img {
                        cursor: pointer;
                    }
                `}</style>
            </div>
        );
    }
}


const mapStateToPorps = state => {
    const config = (state.httpData.config || {}).data;
    const picPrefix = config && (config.basePicPrefix || '');
    const {auth} = state.httpData;
    return {auth, picPrefix};
};


export default connect(mapStateToPorps)(PicShow);
