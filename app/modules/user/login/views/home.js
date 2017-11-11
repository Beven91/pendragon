import "./home.css"
import React from 'react';
import Component from '../../../../components/base';
import Layout from '../../../../components/layout';
import { View,Flex,Text } from 'antd-mobile'; //sss

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {params} = this.props.navigation.state
        return (
            <Layout>
                <Flex className="home-screen">
                    <Flex.Item className="logo">
                        <Text>Welcome ! ${params.name}</Text>
                    </Flex.Item>
                </Flex>
            </Layout>
        )
    }

}