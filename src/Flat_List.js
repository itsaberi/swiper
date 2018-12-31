import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

export default class Flat_List extends Component {

    renderItem(item) {
        return (
            <Card
                key={item.id}
                image={{ uri: item.uri }}
                title={item.text}
            >
                <Text style={{ marginBottom: 10 }}>This is Test</Text>
                <Button
                    title="View"
                />
            </Card>
        )
    }
    render() {
        return (
            <FlatList
                keyExtractor={(item) => item.id}
                data={this.props.data}
                renderItem={({ item }) => this.renderItem(item)}
                horizontal={false}
            />
        )
    }
}