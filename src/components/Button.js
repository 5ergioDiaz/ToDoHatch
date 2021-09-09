import React from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto'

const { width, height } = Dimensions.get("screen");

function taskCard(props) {
    const { label, backgroundColor, borderRadius, width, height, fontSize, onPress } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: backgroundColor ? backgroundColor : 'red',
                borderRadius: borderRadius ? borderRadius : 10,
                width: width ? width : "100%",
                height: height ? height : 50
            }}>
            <Text style={{ fontSize: fontSize ? fontSize : 10, alignContent: 'center', alignSelf: 'center' }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default taskCard

