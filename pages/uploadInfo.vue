<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
            <NuxtLink to="/">Upload File</NuxtLink>
            <NuxtLink to="/uploadInfo">Data Upload Overview</NuxtLink>
        </NuxtLayout>
        <h1>Data Upload Overview</h1>
        <div :key="renderKey">
            <button type="button" @click="showTable">Show Last Uploaded Data</button>
            <table v-if ="tableData?.rows?.length">
                <thead>
                    <tr>
                        <th v-for="(value,key) in tableData.rows[0]" :key="key">
                            {{ key }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in tableData.rows" :key="index">
                        <td v-for="(value, key) in row" :key="key">
                            {{ value }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">

const renderKey = ref(0);
let tableData = ref<{rows: any[], tables: any[]} | null>(null);

async function showTable() {
    await fetch('/api/showFiles')
        .then(response => response.json())
        .then(table => {
            tableData = table;
            renderKey.value += 1;
        })
        .catch(error => {
            console.error('Error fetching upload info:', error);
        });
}
        
</script>