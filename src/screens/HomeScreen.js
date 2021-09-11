import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
    Button,
    Switch,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { addTask, cancelTask, editTask, completeTask } from '../redux/actions/taskActions';
import Geolocation from 'react-native-geolocation-service';
import TaskCard from '../components/TaskCard';
import AppBar from '../components/AppBar'
import AddButton from '../components/AddButton'
import moment from 'moment';

const { height } = Dimensions.get("screen");

const allTasksProps = (state) => {
    return {
        allTasks: state.home.AllTaskReducers.allTasks,
    }
}

const propsDispatch = { addTask, cancelTask, editTask, completeTask }

const HomeScreen = ({ allTasks, addTask, cancelTask, editTask, completeTask }) => {

    const [taskName, setTaskName] = useState(null)
    const [taskNameEdit, setTaskNameEdit] = useState(null)
    const [filter, setFilter] = useState(1)

    const [modalCreate, setModalCreate] = useState(false)
    const [modalUpdate, setModalUpdate] = useState(false)
    const [modalConfirmCancel, setModalConfirmCancel] = useState(false)
    const [modalFilters, setModalFilters] = useState(false)

    const currentEdit = useRef(null)
    const currentIndex = useRef(null)

    // Funcion que agrega la Tarea
    const handleAdd = async () => {
        if (taskName) {
            // Se manda a llamar a la funcion para obtener la ubicación
            Geolocation.getCurrentPosition(
                (position) => {
                    // Se manda a llamar a la función para agregar la Tarea al Array de Tareas
                    addTask({
                        title: taskName ? taskName : "",
                        isComplete: false,
                        createDateTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        lastUpdate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        location: { lat: position.coords.latitude, lng: position.coords.longitude }
                    })
                    setTaskName(null)
                    setModalCreate(false)
                },
                (error) => {
                    temp = false;
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            // Si no se agrego un Caracter se avisa al usuario
            Alert.alert(
                "Invalido",
                "La Tarea debe de tener como minimo 1 Caracter"
            );
        }
    }

    // Funcion para Ver la Informacion a Editar
    const handleModalEdit = (index) => {
        // Se Guarda la Informacion de la Tarea que el Usuario quiere ver o editar
        currentIndex.current = index
        currentEdit.current = allTasks[index]
        setTaskNameEdit(currentEdit.current.taskInfo.title)
        setModalUpdate(true)
    }

    // Funcion Para Editar la TArea
    const handleEditTask = () => {
        if (taskNameEdit) {
            // Se manda a llamar a la funcion para editar la Tarea y se actualiza el nombre si hubo un cambio y se actualiza la ultima actualizacion
            editTask([currentIndex.current, {
                id: currentEdit.current.id, taskInfo: {
                    title: taskNameEdit ? taskNameEdit : currentEdit.current.taskInfo.title,
                    isComplete: currentEdit.current.taskInfo.isComplete,
                    createDateTime: currentEdit.current.taskInfo.createDateTime,
                    lastUpdate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    location: currentEdit.current.taskInfo.location
                }
            }])
            setModalUpdate(false)
        }
        else {
            Alert.alert(
                "Invalido",
                "La Tarea debe de tener como minimo 1 Caracter"
            );
        }
    }

    // Funcion para Cambiar la Tarea a Completado o No Completado
    const handleChangeStatus = (index) => {
        // Se manda a llamar la funcion para actualizar el status de la tarea
        currentEdit.current = allTasks[index]
        completeTask([index, !currentEdit.current.taskInfo.isComplete])
        setModalUpdate(false)
    }

    // Funciona para Eliminar Tareas
    const handleCancel = () => {
        cancelTask(currentIndex.current)
        setModalUpdate(false)
        setModalConfirmCancel(false)
    }

    // Funcion para Filtros
    const handelChangeFilter = (filter) => {
        setFilter(filter)
    }

    return (

        <View style={{ height }}>

            {/* Componente de la NavVar */}
            <AppBar onPress={() => setModalFilters(true)} />

            {/* Componente del Boton para Agregar Tareas */}
            <AddButton onPress={() => { setModalCreate(true) }} />

            {/* Funcion de Map para recorrer todo el Array de Tareas y se filtra dependiendo si el usuario quiere ver todas las tareas, solo las activas o completadas */}
            {allTasks &&
                allTasks.map((task, index) => (
                    filter == 1 ?
                        <TaskCard
                            key={index}
                            taskStatus={task.taskInfo.isComplete}
                            taskName={task.taskInfo.title}
                            checkProp={() => { handleChangeStatus(index) }}
                            editProp={() => { handleModalEdit(index) }}
                        />
                        :
                        filter == 2 && !task.taskInfo.isComplete ?
                            < TaskCard
                                key={index}
                                taskStatus={task.taskInfo.isComplete}
                                taskName={task.taskInfo.title}
                                checkProp={() => { handleChangeStatus(index) }}
                                editProp={() => { handleModalEdit(index) }}
                            />
                            :
                            filter == 3 && task.taskInfo.isComplete &&
                            < TaskCard
                                key={index}
                                taskStatus={task.taskInfo.isComplete}
                                taskName={task.taskInfo.title}
                                checkProp={() => { handleChangeStatus(index) }}
                                editProp={() => { handleModalEdit(index) }}
                            />
                ))
            }

            {/* Modal Create */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCreate}
                onRequestClose={() => { setModalCreate(false) }}>
                <TouchableOpacity
                    style={styles.modalOpacityStyle}
                    onPress={() => { setModalCreate(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalViewStyle}>
                            <Text style={styles.modalTitle}>Agregar Nueva Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={styles.textInput}
                                onChangeText={setTaskName}
                                value={taskName} />
                            <Button
                                title="Agregar"
                                color="#3366FF"
                                onPress={handleAdd} />
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* Modal Update */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalUpdate}
                onRequestClose={() => { setModalUpdate(false) }}>
                <TouchableOpacity style={styles.modalOpacityStyle} onPress={() => { setModalUpdate(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalViewStyle}>
                            <Text style={styles.modalTitle}>Editar Tarea</Text>
                            <Text style={styles.headerInfo}>Titulo de la Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={styles.textInput}
                                onChangeText={setTaskNameEdit}
                                value={taskNameEdit}
                            />

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Fecha de Creacion</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.createDateTime}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Ultima Modificación</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.lastUpdate}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Status</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.isComplete ? "Completado" : "Activo"}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Ubicación</Text>
                                <Text>Latitud: {currentEdit.current && currentEdit.current.taskInfo.location.lat}</Text>
                                <Text>Longitud: {currentEdit.current && currentEdit.current.taskInfo.location.lng}</Text>
                            </View>

                            <Button
                                title="Guardar"
                                color="#3366FF"
                                onPress={handleEditTask}
                            />

                            <View style={{ marginTop: 20 }}>
                                <Button
                                    title="Eliminar"
                                    color="#FF493F"
                                    onPress={() => { setModalConfirmCancel(true) }}
                                />
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* Confirm Cancel */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmCancel}
            >
                <TouchableOpacity style={styles.backPressCancel} onPress={() => { setModalConfirmCancel(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalConfirm}>
                            <Text style={styles.bold}>Estas Seguro de Cancelar esta tarea?</Text>
                            <Text style={styles.bold}>No Podras Recuperarla</Text>
                            <View style={styles.viewCancel}>
                                <View style={{ marginRight: 5 }}>
                                    <Button
                                        title="Cancelar"
                                        color="grey"
                                        onPress={() => { setModalConfirmCancel(false) }}
                                    />
                                </View>
                                <View style={{ marginRight: 5 }}>
                                    <Button
                                        title="Aceptar"
                                        color="#FF493F"
                                        onPress={handleCancel}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* Filters Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalFilters}
            >
                <TouchableOpacity style={styles.modalFiltersBack} onPress={() => { setModalFilters(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalFilters}>
                            <Text style={styles.bold}>Filtros</Text>
                            <View style={styles.modalFiltersSwitch}>
                                <View style={{ marginRight: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.bold}>Todos</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={filter == 1 ? "#3366FF" : "#f4f3f4"}
                                        onValueChange={() => { handelChangeFilter(1) }}
                                        value={filter == 1 ? true : false}
                                    />
                                </View>
                                <View style={{ marginRight: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.bold}>Activos</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={filter == 2 ? "#3366FF" : "#f4f3f4"}
                                        onValueChange={() => { handelChangeFilter(2) }}
                                        value={filter == 2 ? true : false}
                                    />
                                </View>
                                <View style={{ marginRight: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.bold}>Completados</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={filter == 3 ? "#3366FF" : "#f4f3f4"}
                                        onValueChange={() => { handelChangeFilter(3) }}
                                        value={filter == 3 ? true : false}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

        </View>

    );
}

const styles = StyleSheet.create({
    modalOpacityStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalViewStyle: {
        backgroundColor: 'white',
        padding: 22,
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
    },
    textInput: {
        height: 50,
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 10,
        color: 'black',
        marginBottom: 20
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        marginBottom: 20
    },
    headerInfo: {
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    space: {
        marginBottom: 10
    },
    modalConfirm: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center"
    },
    modalFilters: {
        margin: 10,
        marginTop: 60,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center"
    },
    modalFiltersBack: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalFiltersSwitch: {
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    backPressCancel: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    bold: {
        fontWeight: 'bold'
    },
    viewCancel: {
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
});

export default connect(
    allTasksProps,
    propsDispatch
)(HomeScreen)

