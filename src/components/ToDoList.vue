<template>
  <ion-item
    v-for="todo in data"
    :key="todo.id"
    :disabled="disabled"
    style="--padding-start: 0px"
  >
    <ion-label style="margin-right: 0px">
      <div
        style="
          text-transform: capitalize;
          margin-bottom: 0px;
          font-size: 24px;
          font-weight: bold;
        "
      >
        {{ todo.name }}
      </div>
      <div style="margin-top: 8px">
        {{ todo.completed ? "Completed" : "In Progress" }}
      </div>
      <div style="font-size: smaller; margin-top: 8px">{{ fixDateTime(todo) }}</div>
      <ion-button style="float: right" size="small" @click="() => toggleStatus(todo)"
        >STATUS</ion-button
      >
      <ion-button style="float: right" size="small" @click="emits('edit', todo)"
        >EDIT</ion-button
      >
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonButton, IonItem, IonLabel } from "@ionic/vue";
import { doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { todos_collection } from "@/firebase-service";

const props = defineProps<{
  data: any;
  disabled: boolean;
}>();

const emits = defineEmits<{
  (event: "edit", todo: any): void;
}>();

const fixDateTime = (todo) => {
  const dt = todo?.updated?.toDate() || todo?.created?.toDate();
  return dt?.toLocaleString();
};

const toggleStatus = (todo) => {
  updateDoc(doc(todos_collection, todo.id), {
    completed: !todo.completed,
    updated: serverTimestamp(),
  });
};
</script>
