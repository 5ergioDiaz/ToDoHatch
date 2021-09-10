import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const { width, height } = Dimensions.get("screen");

function taskCard(props) {
    const { taskStatus, taskName } = props;
    return (
        <View style={{ backgroundColor: 'grey', height: height / 15, width: '90%', marginBottom: 20, borderRadius: 10, alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: 20, marginLeft: 30 }}>
                <TouchableOpacity style={{ alignContent: 'flex-start', width: '20%' }}>
                    <View style={{
                        backgroundColor: taskStatus == 1 ? 'blue' : 'transparent',
                        borderWidth: 3,
                        borderColor: 'blue',
                        width: 20,
                        height: 20
                    }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', width: '80%' }} onPress={()=>{console.log("1")}}>
                    <View style={{ width: "80%" }}>
                        <Text numberOfLines={1} style={{ fontSize: 20 }}>{taskName ? taskName : "Tarea"}</Text>
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
