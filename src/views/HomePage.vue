<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Vue Fire To Do</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="computedToDoValue">
        <ion-card class="ion-padding" style="margin: 0px; margin-bottom:16px">
          <ion-card-subtitle>EDIT TO DO</ion-card-subtitle>
          <edit-to-do-component :todo="computedToDoValue" @update="handleUpdateToDo" />
        </ion-card>
      </div>
      <div v-if="!computedToDoValue">
        <ion-card class="ion-padding" style="margin: 0px; margin-bottom:16px">
          <ion-card-subtitle>CREATE TO DO</ion-card-subtitle>
          <ion-item style="--padding-start: 0px">
            <ion-input
              type="text"
              v-model="newTodo"
              aria-placeholder="todo text"
              placeholder="todo text"
              label="TO DO"
            ></ion-input>
            <ion-button @click="addTodo">SAVE</ion-button>
          </ion-item>
        </ion-card>
      </div>

      <!-- SELECT COMPONENT -->
      <ion-item style="--padding-start: 0px" :disabled="computedToDoValue !== null">
        <ion-select
          label="Filter To Do's"
          label-placement="stacked"
          v-model="selectedQuery"
        >
          <ion-select-option value="ALL">All</ion-select-option>
          <ion-select-option value="COMPLETE">Completed</ion-select-option>
          <ion-select-option value="INCOMPLETE">In Progress</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- LIST COMPONENT -->
      <p v-if="data?.length">
        <to-do-list
          :data="data"
          @edit="handleEditEvent"
          :disabled="computedToDoValue !== null"
        ></to-do-list>
      </p>

      <!-- ERROR COMPONENT -->
      <p v-if="error">{{ error?.message }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardSubtitle
} from "@ionic/vue";
import { useCollection } from "vuefire";
import { todos_collection } from "../firebase-service";
import ToDoList from "@/components/ToDoList.vue";
import EditToDoComponent from "@/components/EditToDoComponent.vue";
import { ref, computed } from "vue";
import {
  Timestamp,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";

const editToDoValue = ref();
const computedToDoValue = computed(() => (editToDoValue.value ? editToDoValue : null));

const QUERY_MAP = {
  ["ALL"]: query(todos_collection, orderBy("created", "asc")),
  ["INCOMPLETE"]: query(
    todos_collection,
    orderBy("created", "asc"),
    where("completed", "==", false)
  ),
  ["COMPLETE"]: query(
    todos_collection,
    orderBy("created", "asc"),
    where("completed", "==", true)
  ),
};

const selectedQuery = ref<"ALL" | "COMPLETE" | "COMPLETE">("ALL");

// update the query based on selected option
const theQuery = computed(() => {
  return QUERY_MAP[selectedQuery.value];
});

// get the data
const { data, error } = useCollection(theQuery, { ssrKey: "false" });

// used for creating new entry
const newTodo = ref("");

/**
 * adding a new entry
 */
const addTodo = async () => {
  await setDoc(doc(todos_collection), {
    completed: false,
    name: newTodo.value,
    created: Timestamp.now(),
    updated: Timestamp.now(),
  });
  newTodo.value = "";
};

const handleEditEvent = (payload: any) => {
  console.log(payload);
  editToDoValue.value = { ...payload, id: payload.id };
};

const handleUpdateToDo = (payload: any) => {
  console.log(payload);
  if (!payload) return;
  debugger;
  updateDoc(doc(todos_collection, payload.id), {
    name: payload.name,
    updated: serverTimestamp(),
  });
};
</script>

<style scoped></style>
