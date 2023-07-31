<template>
  <ion-item style="--padding-start: 0px" v-if="editTodo">
    <ion-input
      type="text"
      v-model="editTodo.name"
      aria-placeholder="todo text"
      placeholder="todo text"
      label="TO DO"
    ></ion-input>
    <ion-button @click="()=>updateToDo(false)">UPDATE</ion-button>
    <ion-button @click="() => updateToDo(true)">CANCEL</ion-button>
  </ion-item>
</template>
<script setup lang="ts">
import { IonInput, IonItem, IonButton } from "@ionic/vue";
import { ref, watch } from "vue";
const props = defineProps(["todo"]);
const emits = defineEmits<{
  (event: "update", todo: any): void;
}>();

const editTodo = ref(props.todo);

const updateToDo = (cancel: boolean) => {
  if (cancel) {
    editTodo.value = null;
    emits("update");
    return;
  }
  debugger;
  emits("update", editTodo.value);
  editTodo.value = null;
};
</script>
