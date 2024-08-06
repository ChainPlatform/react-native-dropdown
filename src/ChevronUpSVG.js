import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default class ChevronUpSVG extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let origin_width = 512;
        let origin_height = 512;
        let height = typeof this.props.width != "undefined" ? (this.props.width * origin_height) / origin_width : 0;
        return (
            <Svg width={this.props.width} height={height} viewBox="0 0 512 512">
                <Path fill="none" stroke={this.props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M112 328l144-144 144 144" />
            </Svg>
        );
    }
}