

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/uploadInfo">Data Upload Overview</NuxtLink>
    </NuxtLayout>
  </div>
  <div>
    <h1>File Upload</h1>
    <p>Upload your data files here.</p>
    <form @submit.prevent="handleFormSubmit">
      <label for="file">Select file 1:</label>
      <input type="file" id="file" name="file" accept=".csv" @change="handleFileChange" />
      <br />
      <label for="file">Select file 2:</label>
      <input type="file" id="file2" name="file2" accept=".csv" @change="handleFileChange" />
      <br />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  // const {data} = await useFetch('/api/data')

  // async function handleFormSubmit(event: Event) {
  //   event.preventDefault();
  //   console.log('Form submitted');
  //   console.log('Selected file 1:', (event.target as HTMLFormElement).file.value);
  //   console.log('Selected file 2:', (event.target as HTMLFormElement).file2.value);
  //   console.log('Data from API:', data.value);
    
  // }



import Papa from 'papaparse';

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    console.error('No file selected');
    return;
  }
  Papa.parse(file,{
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const expectedHeaders = ['id', 'name', 'date', 'value1', 'value2', 'status'];
      const actualHeaders = Object.keys(results.data[0] || {});

      const isValid = expectedHeaders.every(header => actualHeaders.includes(header));
      if (!isValid) {
        console.error('Invalid file format. Expected headers:', expectedHeaders);
        alert('Invalid file format. Please upload a file with the correct headers.');
        (event.target as HTMLInputElement).value = '';
        return;
      }

      console.log('Parsed data:', results.data);
    },
  })
}

function handleFormSubmit() {
  
}

</script>

<style module>
  @import url('~/assets/css/main.css');
</style>
