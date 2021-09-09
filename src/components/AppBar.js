import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

const { width, height } = Dimensions.get("screen");

function taskCard() {
    return (
        <View style={{ backgroundColor: 'red', height: height / 15, width: '100%', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: 20, marginLeft: 30 }}>
                <View style={{ width: '90%', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ fontSize: 20 }}>Mis Tareas</Text>
                </View>
                <View style={{ alignContent: 'flex-end', width: '10%' }}>
                    <Feather name='more-vertical' size={25} />
                </View>
            </View>
        </View>
    )
}

export default taskCard
