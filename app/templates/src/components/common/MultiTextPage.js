import React from "react";
import Editor from "react-umeditor";
import {baseUrl, get} from "@/axios/tools";

export default class MultiTextPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.refs.editor.setState({
            loaded: true,
        });
    }

    setContent = (content = '') => {
        this.refs.editor.setContent(content);
    };

    getContent = () => {
        this.refs.editor.getContent();
    };

    onChange(content) {
        this.props.onChange(content);
    }

    getIcons() {
        return [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ];
    }

    getPlugins() {
        return {
            "image": {
                "uploader": {
                    "name": "file",
                    'type': 'default',
                    "url": baseUrl + '/common/saveFile'
                }
            }
        }
    }

    render() {
        const icons = this.getIcons();
        const plugins = this.getPlugins();
        return (<div className="content-container">
            <Editor ref="editor"
                    icons={icons}
                    value={this.props.value}
                    onChange={this.onChange.bind(this)}
                    plugins={plugins}/>
        </div>)
    }
}