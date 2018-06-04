/**分装table
 * Created by huotaol on 2017/12/20.
 */
import React from "react";
import {Button, Table} from "antd";
import {DragDropContext, DragSource, DropTarget} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";


function dragDirection(dragIndex,
                       hoverIndex,
                       initialClientOffset,
                       clientOffset,
                       sourceClientOffset,) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = {cursor: 'move'};

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);


class TableContainer extends React.Component {

    static defaultProps = {
        pageSize: 15,
        bordered: true,
        showSizeChanger: false,
        canDragSort: false,
        dragSortCallBack: () => {
        },
        callBack: () => {
        },
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],
            currentPage: 1,
            pageSize: props.pageSize,
            total: 0,
        };
    }


    componentDidMount() {
        this.reset();
        this.props.callBack(this);
    }

    reset = () => {
        this.setState({data: []});
        this._requestData(1, this.state.pageSize);
    };

    _requestData = (current, pageSize) => {
        this.props.requestData(current, pageSize).then(data => {
            const list = data.list.map(v => {
                v = {key: v.id, ...v};
                return v;
            });
            this.setState({data: list, total: data.total, currentPage: current, pageSize});
        });
    };

    components = {
        body: {
            row: BodyRow,
        },
    };

    moveRow = (dragIndex, hoverIndex) => {
        const {data} = this.state;
        const dragRow = data[dragIndex];

        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    };

    _dragSort = () => {
        this.props.dragSortCallBack(this.state.data);
    };

    _showDragSort = () => {
        if (this.props.canDragSort) {
            return <div>
                <Button onClick={this._dragSort}>提交排序修改</Button>
                <div className="space-bar"></div>
            </div>
        }
    };

    render() {
        const {showSizeChanger, canDragSort} = this.props;
        const showDrag = canDragSort ? {
            components: this.components,
            onRow: (record, index) => ({
                index,
                moveRow: this.moveRow,
            })
        } : null;
        return (
            <div>
                {this._showDragSort()}
                <Table
                    {...this.props}
                    dataSource={this.state.data}
                    {...showDrag}
                    pagination={
                        {
                            total: this.state.total,
                            showSizeChanger: showSizeChanger,
                            defaultPageSize: this.state.pageSize,
                            current: this.state.currentPage,
                            onShowSizeChange: this._requestData,
                            onChange: this._requestData
                        }
                    }/>
            </div>
        );
    }
}
export default DragDropContext(HTML5Backend)(TableContainer);