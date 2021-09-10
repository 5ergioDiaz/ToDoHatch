/**
 * NavBar Component
 * @author Sergio Julian Diaz Topete
 */
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

const { width } = Dimensions.get("screen");

function taskCard(props) {
    const { onPress } = props;

    return (
        <View style={{ backgroundColor: '#3366FF', height: width * 0.13, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: width * 0.02, marginLeft: 30 }}>
                <View style={{ width: '90%', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ fontSize: width * 0.05 }}>Mis Tareas</Text>
                </View>
                <View style={{ alignContent: 'flex-end', width: '10%' }}>
                    <Feather name='more-vertical' size={width * 0.08} onPress={onPress} />
                </View>
            </View>
        </View>
    )
}

export default taskCard
