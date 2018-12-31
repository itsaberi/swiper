import React, { Component } from 'react';
import { View, PanResponder, Animated, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const styles = {
    cardStyle:{
        position: 'absolute',
        width: SCREEN_WIDTH
    }
}

export default class Deck extends Component {

    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = new PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                Animated.spring(this.state.position, {
                    toValue: { x: gesture.dx, y: gesture.dy }
                }).start();
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                }
                else {
                    this.resetPosition();
                }
            }
        });
        this.state = { panResponder, position, index: 0 }
    }

    forceSwipe(direction) {
        const x = direction == 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x: x, y: 0 },
            duration: 250
        }).start(() => this.onSwipeComplete());
    }

    onSwipeComplete() {
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    resetPosition() {
        const { position } = this.state;
        Animated.spring(position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate: rotate }]
        }
    }

    renderCard() {
        if(this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards();
        }
        return this.props.data.map((item, i) => {
            if (i < this.state.index) { return null; }
            if (i === this.state.index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return(
                <View key={item.id} style={styles.cardStyle}>
                    {this.props.renderCard(item)}
                </View>
            );
        }).reverse();
    }

    render() {
        return (
            <View>
                {this.renderCard()}
            </View>
        )
    }
}