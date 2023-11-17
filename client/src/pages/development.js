import React from 'react';
import Helmet from "react-helmet"

function DevelopmentPage() {
    return (
        <div>
            <Helmet>
                <title>功能正在开发中</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Helmet>
            <div className="Development">
                <h1>该功能正在开发，压力大古以获取加速</h1>
            </div>
        </div>
    );
}

export default DevelopmentPage;
