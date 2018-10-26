import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    PanResponder
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width

const ARTICLES = [
    { id: "1", uri: require('./assets/1.png') },
    { id: "2", uri: require('./assets/2.png') },
    { id: "3", uri: require('./assets/3.jpg') },
    { id: "4", uri: require('./assets/4.png') },
    { id: "5", uri: require('./assets/5.png') },
]

class DeckSwiper extends Component {
    constructor(props) {
        super(props)

        this.position = new Animated.ValueXY()
        this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT }) // Card swiped off screen
        this.state = {
            currentIndex: 0
        }
    }

    componentWillMount() {
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (e, gestureState) => true,

            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0 && (this.state.currentIndex > 0)) { // Pulling down, any card that's not the 1st card
                    this.swipedCardPosition.setValue({  // from the top screen which is a full ScreenHeight above
                        x: 0, y: -SCREEN_HEIGHT + gestureState.dy //  will be moved according to the gesture
                    })
                }
                else {
                    this.position.setValue({ y: gestureState.dy }) // Or else move the 1st card w/ the gesture
                }
            },

            onPanResponderRelease: (evt, gestureState) => { // After user releases gesture
                // For cards that have already been swiped up, and the user wants to swipe it back down
                if (this.state.currentIndex > 0 && gestureState.dy > 50 && gestureState.vy > 0.7) {
                    Animated.timing(this.swipedCardPosition, { // If not top card, swiped down and fast enough
                        toValue: ({ x: 0, y: 0 }),  // bring that card down to the sceen base
                        duration: 400
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex - 1 }) // & make that card the current card
                        this.swipedCardPosition.setValue({ x: 0, y: -SCREEN_HEIGHT }) // Put the following card adjacent & right above this card
                    })
                }
                else if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
                    // Swipe up (up is - y), if it goes far & fast enough
                    Animated.timing(this.position, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),  // the card will automatically swipe up 1 screen height
                        duration: 400
                    }).start(() => {
                        // the next card below (0 on top of 1 ..) becomes the active card, put the PanResponder on it
                        this.setState({ currentIndex: this.state.currentIndex + 1 })
                        this.position.setValue({ x: 0, y: 0 })  // ? PanResponder starts measuring at 0, 0 ?
                    })
                }
                else { // Spring back to original state
                    Animated.parallel([
                        Animated.spring(this.position, { // This card that's being pulled springs back to the orig position
                            toValue: ({ x: 0, y: 0 })
                        }),
                        Animated.spring(this.swipedCardPosition, { // The (already swipedupCard) card not pulled down fast/far enough goes back up
                            toValue: ({ x: 0, y: -SCREEN_HEIGHT })
                        })
                    ]).start()
                }
            }
        })

    }  // End of ComponentWillMount
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    renderArticles = () => {
        return ARTICLES.map((item, i) => {
            if (i == this.state.currentIndex - 1) { //  Swiped up cards need to be animated to go back down, so
                // if you swipe down you need the previous card (-1) to follow it down
                return (
                    <Animated.View key={item.id} style={this.swipedCardPosition.getLayout()}
                        {/* the position will be the swipedCardPosition which is -the ScreenHeight */ }
                        {...this.PanResponder.panHandlers}
                    >
                        <View style={{ flex: 1, position: 'absolute', height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: 'white' }}>
                            <View style={{ flex: 2, backgroundColor: 'black' }}>
                                <Image source={ARTICLES[i].uri}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center' }}
                                ></Image>
                            </View>
                            <View style={{ flex: 3, padding: 5 }}>
                                <Text>
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
              </Text>
                            </View>
                        </View>
                    </Animated.View>
                )
            }
            else if (i < this.state.currentIndex) {
                return null  // Hide the card(s) that's been swiped up. 0,1,2,3,4 except for the previous adjacent one (above)
            }
            if (i == this.state.currentIndex) {
                return (    // Put the PanResponder on the top card only
                    <Animated.View key={item.id} style={this.position.getLayout()}
                        {...this.PanResponder.panHandlers}
                    >
                        <View style={{ flex: 1, position: 'absolute', height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: 'white' }}>
                            <View style={{ flex: 2, backgroundColor: 'black' }}>
                                <Image source={ARTICLES[i].uri}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center' }}
                                ></Image>
                            </View>
                            <View style={{ flex: 3, padding: 5 }}>
                                <Text>
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
              </Text>
                            </View>
                        </View>
                    </Animated.View>
                )
            }

            else {
                // If it's not the current card being swiped, or the swiped up cards (which will be 1 screenheight above) then leave all the cards underneath the deck
                return (
                    <Animated.View key={item.id}
                    >
                        <View style={{ flex: 1, position: 'absolute', height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: 'white' }}>
                            {/*  Position is absolute so the images stack on each other */}
                            <View style={{ flex: 2, backgroundColor: 'black' }}>
                                <Image source={ARTICLES[i].uri}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center' }}
                                ></Image>
                            </View>
                            <View style={{ flex: 3, padding: 5 }}>
                                <Text>
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
                                    Labore irure excepteur deserunt qui. Occaecat do consequat velit adipisicing consequat reprehenderit incididunt duis irure ea consequat ipsum Lorem dolor. Culpa consectetur nisi officia excepteur anim mollit nostrud ut voluptate. Quis velit dolore fugiat veniam eu labore adipisicing ipsum incididunt ad amet. Do veniam adipisicing veniam commodo exercitation officia et commodo Lorem nostrud culpa tempor dolor.
              </Text>
                            </View>
                        </View>
                    </Animated.View>
                )
            }
        }).reverse() // #5 Appears on top 1st, so have to reverse to get 1,2,3,4,5.  + Means a card below
        // End of Map
    } // ~~~~~~~~~~~End of Render Articles~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderArticles()}
            </View>
        );
    }
}  // End of DeckSwiper Component
export default DeckSwiper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});