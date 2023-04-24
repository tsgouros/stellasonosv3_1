import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Modal,
  Alert,
  Text,
  ImageBackground,
  Pressable,
} from "react-native";



import { Dimensions } from "react-native";
//import { AntDesign } from "@expo/vector-icons";
import { Button } from "@rneui/base";
import {Player} from '@react-native-community/audio-toolkit';
//import SoundPlayer from 'react-native-sound-player'

export default function SoundPage({ route, navigation }) {
  const { image, name } = route.params;

  const pan = useRef(new Animated.ValueXY()).current;
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [sound, setSound] = useState(null);

  const xPadding = 45;


  function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
const blankSound = new Player("https://stellasonos-files.vercel.app/" + "/samples/" + "bassoon" + "/" + "G1" + ".mp3", {autoDestroy: false});
blankSound.volume = 0.0
blankSound.play()


const newPlayer = new Player("https://stellasonos-files.vercel.app/" + "/samples/" + "bassoon" + "/" + "G1" + ".mp3", {autoDestroy: false});
newPlayer.looping = true



const player2 = new Player("https://stellasonos-files.vercel.app/" + "/samples/" + "clarinet" + "/" + "D3" + ".mp3", {autoDestroy: false});
player2.looping = true

async function playSoundToolkit() {

  try {

    // Seems to work best so far
    newPlayer.play()
    // await delay(3500)
    // player2.play()

   }catch (e) {
    console.log(`cannot play the sound file`, e)
  }
}
async function playSecondSound() {

  try {

    // Seems to work best so far
    player2.play()
    // await delay(3500)
    // player2.play()

   }catch (e) {
    console.log(`cannot play the sound file`, e)
  }
}

async function changeSoundToolkit() {

  try {
    // Seems to work best so far
    newPlayer.stop()
    player2.stop()
    // await delay(3500)
    // player2.play()

   }catch (e) {
    console.log(`cannot play the sound file`, e)
  }
}

async function stopSoundToolkit() {

  try {

    // Seems to work best so far
    newPlayer.stop()
    // testPlayer.stop()
    player2.stop()
   }catch (e) {
    console.log(`could not pause sound`, e)
  }
}
  
  // calculating actual width and height of touch area

  const xMax = Dimensions.get("window").width / 2 - xPadding;
  const yMax = Dimensions.get("window").height / 6 + 125;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, r) => {
        // prevent the dot from moving out of bounds with simple ternary operators

        pan.setOffset({
          x:
            pan.x._value > xMax
              ? xMax
              : pan.x._value < -xMax
              ? -xMax
              : pan.x._value,
          y:
            pan.y._value > yMax
              ? yMax
              : pan.y._value < -yMax
              ? -yMax
              : pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      
        useNativeDriver: false,

        onPanResponderRelease: (event, gestureState) => {
          //After the change in the location


        },


      }),

     
      onPanResponderRelease: (e, r) => {
        pan.flattenOffset();
        setCurrentY(pan.y._value);
        setCurrentX(pan.x._value);
      },
    })
  ).current;

  // update current x and y values in the state for later
  pan.x.addListener(({ value }) => {
    setCurrentX(value);
  });
  pan.y.addListener(({ value }) => {
    setCurrentY(value);
  });
  const handleX = (delta) => {
    var newX =
      currentX + delta > xMax
        ? xMax
        : currentX + delta < -xMax
        ? -xMax
        : currentX + delta;
    pan.setValue({ x: newX, y: currentY });
  };
  const handleY = (delta) => {
    var newY =
      currentY + delta > yMax
        ? yMax
        : currentY + delta < -yMax
        ? -yMax
        : currentY + delta;
    pan.setValue({ x: currentX, y: newY });
  };




  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {image.title}: {"\n"}
              {image.description}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        {/* Preventing the dot from going out of bounds       */}
        <Animated.View
          style={{
            transform: [
              {
                translateX: pan.x.interpolate({
                  inputRange: [-xMax, xMax],
                  outputRange: [-xMax, xMax],
                  extrapolate: "clamp",
                }),
              },
              {
                translateY: pan.y.interpolate({
                  inputRange: [-yMax, yMax],
                  outputRange: [-yMax, yMax],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.circle} />
        </Animated.View>
        <View
          style={styles.imageContainer}
          onStartShouldSetResponder={() => true}
          onResponderMove={(event) => {        
            //console.log('hi');  
            pan.setValue({
              x: event.nativeEvent.locationX - xMax - 20,
              y: event.nativeEvent.locationY - yMax - 20,
            });
            console.log(event.nativeEvent.pageX, event.nativeEvent.pageY, event.nativeEvent.locationX, event.nativeEvent.locationY, yMax, xMax,  );
            /*

            Where the actual motion is taking place

            */
           //playSoundToolkit()

            
        }}
 
        
        >
          <ImageBackground
            style={styles.tinyLogo}
            source={{ uri: image.src }}
          ></ImageBackground>
        </View>
      </View>


      {<View style={styles.toolBar}>
        {/* <AntDesign
          onPress={() => handleX(-10)}
          name="leftcircleo"
          size={30}
          color="black"
        />
        <AntDesign
          onPress={() => handleX(10)}
          name="rightcircleo"
          size={30}
          color="black"
        />
        <AntDesign
          onPress={() => handleY(-10)}
          name="upcircleo"
          size={30}
          color="black"
        />
        <AntDesign
          onPress={() => handleY(10)}
          name="downcircleo"
          size={30}
          color="black"
        />
        <AntDesign
          onPress={() => setModalVisible(true)}
          name="infocirlceo"
          size={30}
          color="black"
        /> */}
      {/* <View>
        <Button onPress={playSoundToolkit}>Play Sound</Button>
      </View>
      <View>
        <Button onPress={stopSoundToolkit}>Stop Sound</Button>
      </View> */}
      <Button onPress={playSoundToolkit} >Play Sound</Button>
      <Button onPress={playSecondSound} >Play Sound 2</Button>          
      <Button onPress={stopSoundToolkit} >Stop Sound</Button>


      
      </View> }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold",
  },
  circle: {
    height: 40,
    width: 40,
    backgroundColor: "blue",
    borderRadius: 50,
  },
  imageContainer: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height / 1.3,
    backgroundColor: "#000",
    margin: 0,
    zIndex: -1,
    elevation: -1,
    position: "absolute",
  },
  tinyLogo: {
    flex: 1,
    width: null,
    height: null,
    margin: 0,
    maxHeight: "100%",
    maxWidth: "100%",
  },
  absolute: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  toolBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 350,
    paddingBottom: 30,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2.5,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    padding: 5,
    elevation: 2,
    marginTop: 0,
  },
  buttonClose: {
    backgroundColor: "black",
    backgroundColor: "rgba(11, 127, 171, 0.7)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});
