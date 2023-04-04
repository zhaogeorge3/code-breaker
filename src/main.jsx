import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Helmet} from "react-helmet";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Helmet>
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9498355178338037"
                    crossOrigin="anonymous"></script>
        </Helmet>
        <App/>
    </React.StrictMode>,
)
