import { ADD_TASK, EDIT_TASK, COMPLETE_TASK, CANCEL_TASK } from "../constants";

const initialState = {
  allTasks: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    // AddTask Se agrega la nueva tarea al array y se regresa el nuevo array
    case ADD_TASK: {
      const { id, taskInfo } = action.data
      return {
        ...state,
        allTasks: [...state.allTasks, { id, taskInfo }]
      };
    }
    // EditTask con la informacion que recibe se busca el array que se va a editar y se sustituye por el nuevo que mandaron
    case EDIT_TASK: {
      const { id, taskInfo } = action.data
      state.allTasks[taskInfo[0]] = taskInfo[1]
      return {
        ...state,
        allTasks: state.allTasks
      };
    }
    // CompleteTask con la informacion que llega se busca el array y se navega directamente hasa el json que contiene el status de la Tarea y se cambia por el nuevo
    case COMPLETE_TASK: {
      const { id, taskInfo } = action.data
      state.allTasks[taskInfo[0]].taskInfo.isComplete = taskInfo[1]
      return {
        ...state,
        allTasks: [...state.allTasks]
      };
    }
    // CancelTask se busca la posicion del que se va a eliminar y se borra del Array
    case CANCEL_TASK: {
      const { id } = action.data
      state.allTasks.splice(id, 1)
      return {
        ...state,
        allTasks: state.allTasks
      };
    }
    default:
      return state;
  }
}
