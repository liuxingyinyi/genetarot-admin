import React from "react";

class IndexPage extends React.Component {
    render() {
        return (
            <div className="logo-wrapper">
                <img src={require('@/asset/index_logo.png')}/>
            </div>
        )
    }
}

export default IndexPage;