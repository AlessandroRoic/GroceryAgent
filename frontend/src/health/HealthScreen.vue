<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { HealthResponse } from "@grocery-agent/contracts";
import { getHealth } from "./healthApi.ts";

const status = ref<HealthResponse["status"]>();
const failed = ref(false);

onMounted(async () => {
  try {
    status.value = (await getHealth()).status;
  } catch {
    failed.value = true;
  }
});
</script>

<template>
  <main>
    <h1>GroceryAgent</h1>
    <p v-if="failed" role="alert">Could not check server health.</p>
    <p v-else role="status">
      {{ status === undefined ? "Checking server health…" : `Server status: ${status}` }}
    </p>
  </main>
</template>
