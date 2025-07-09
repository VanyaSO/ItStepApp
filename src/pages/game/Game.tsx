import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { AppContext } from "../../shared/context/AppContext";
import { useContext, useState } from "react";

type EventData = {
    x: number,
    y: number,
    t: number
};
const distanceThreshold = 50;  // поріг спрацьовування свайпу (мін. відстань проведення)
const timeThreshold = 500;     // поріг спрацьовування свайпу (макс. час проведення)

export default function Game() {
    const {navigate} = useContext(AppContext);
    // swipes - жести проведення з обмеженням мінімальних
    // відстаней та швидкостей
    const [text,setText] = useState("Game");
    var startData: EventData|null = null;
    const detectSwipe = (finishData: EventData) => {
        if(startData == null) return;
        const dx = finishData.x - startData!.x;
        const dy = finishData.y - startData!.y;
        const dt = finishData.t - startData!.t;
        // console.log(dx,dy,dt);
        if(dt < timeThreshold) {
            if(Math.abs(dx) > Math.abs(dy)) {  // horizontal
                if(Math.abs(dx) > distanceThreshold) {
                    if(dx > 0) {
                        setText("Right");
                    }
                    else {
                        setText("Left");
                    }
                }
            }
            else {  // vertical
                if(Math.abs(dy) > distanceThreshold) {
                    if(dy > 0) {
                        setText("Down");
                    }
                    else {
                        setText("Up");
                    }
                }
            }
        }
    };

    return <TouchableWithoutFeedback
                onPressIn = {e => {startData = {
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    t: e.nativeEvent.timestamp
                }}}
                onPressOut={e => detectSwipe({
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    t: e.nativeEvent.timestamp
                })}> 

        <View style={styles.container}>
            <Pressable onPress={() => navigate('calc')}>
                <Text>{text}</Text>    
            </Pressable> 
        </View>
    </TouchableWithoutFeedback>;
}


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
