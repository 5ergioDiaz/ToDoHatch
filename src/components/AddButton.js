import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto'

const { width, height } = Dimensions.get("screen");

function taskCard(props) {
    const { onPress } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            underlayColor="#3366FF"
            style={{
                zIndex: 999,
                position: 'absolute',
                alignItems: 'center',
                bottom: height * 0.1,
                right:0,
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 80 / 2,
                borderColor: "#000",
                borderWidth: 3,
                backgroundColor: '#3366FF',
            }}>

            <Fontisto name='plus-a' size={30} />
        </TouchableOpacity>
    )
}

export default taskCard

