<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onMounted, resolveComponent } from "vue";
import { firebaseAuth } from "./firebase-service";
console.log(firebaseAuth);

onMounted(async () => {
  await new Promise((resolve) =>
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        const resp = await signInWithEmailAndPassword(
          firebaseAuth,
          "aaron1@mail.com",
          "password"
        );
        console.log("login",resp);
        resolve(resp.user);
      } else {
        console.log("existing",user);
        resolve(user);
      }
    })
  );
});
</script>
