import React, { Component } from 'react';
import './AppFooter.css';

class AppFooter extends Component {
    render() {
        return (
            <footer>
                <div className="text-center">
                    © 2024 Copyright:
                    <a className="text-white" href="http://localhost:3000/">MANZENAQUE LTD.</a>
                </div>
            </footer>
        )
    }
}

export default AppFooter;