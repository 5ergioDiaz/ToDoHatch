import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto'

const { width, height } = Dimensions.get("screen");

function taskCard(props) {
    const { onPress } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            underlayColor="#2882D8"
            style={{
                position: 'absolute',
                top: height * 0.85,
                left: width * 0.78,
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 80 / 2,
                borderColor: "#000",
                borderWidth: 3,
                backgroundColor: 'red',
            }}>

            <Fontisto name='plus-a' size={30} />
        </TouchableOpacity>
    )
}

export default taskCard

