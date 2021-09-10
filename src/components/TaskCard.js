import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const { width, height } = Dimensions.get("screen");

function taskCard(props) {
    const { taskStatus, taskName, checkProp, editProp } = props;
    return (
        <View style={{ backgroundColor: 'grey', height: width * 0.15, width: '90%', marginBottom: 20, borderRadius: 10, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                <TouchableOpacity style={{ alignContent: 'flex-start', width: '20%' }}
                    onPress={checkProp}>
                    <View style={{
                        backgroundColor: taskStatus ? 'blue' : 'transparent',
                        borderWidth: 3,
                        borderColor: 'blue',
                        width: 20,
                        height: 20
                    }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', width: '80%' }} onPress={editProp}>
                    <View style={{ width: "80%" }}>
                        <Text numberOfLines={1} style={{ fontSize: width * 0.05 }}>{taskName ? taskName : `Tarea`}</Text>
                    </View>
                    <View style={{ alignContent: 'flex-end', width: '20%' }}>
                        <MaterialIcons name='arrow-forward-ios' size={20} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default taskCard
