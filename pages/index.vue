

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
      <input type="file" id="file2" name="file2" accept=".csv" @change="handleSecondFileChange" />
      <br />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script setup lang="ts">

import Papa from 'papaparse';

interface emptyObject {
  id?: string;
  name?: string;
  date?: string;
  value1?: string;
  value2?: string;
  status?: string;
}

let fileName ='';
let secondFileName = '';
let GlResult : Papa.ParseResult<emptyObject> ={
  data: [],
  errors: [],
  meta: {
    cursor: 0,
    aborted: false,
    delimiter: ',',
    fields: [],
    linebreak: '\n',
    truncated: false,
  },
};
let GlSecondResult : Papa.ParseResult<emptyObject> ={
  data: [],
  errors: [],
  meta: {
    cursor: 0,
    aborted: false,
    delimiter: ',',
    fields: [],
    linebreak: '\n',
    truncated: false,
  },
};

function fileReader(file: File, event: Event) {
  Papa.parse<emptyObject>(file,{
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const expectedHeaders = ['id'];
      const actualHeaders = Object.keys(results.data[0] || {});

      const isValid = expectedHeaders.every(header => actualHeaders.includes(header));
      if (actualHeaders.length >= 5){
        console.log('File has more than 5 rows, proceeding with parsing.');
      }else{
        console.error('File has less than 5 rows, please check the file.');
        alert('File has less than 5 rows, please check the file.');
        (event.target as HTMLInputElement).value = '';
        return false;
      }
      if (!isValid) {
        console.error('Invalid file format. Expected headers:', expectedHeaders);
        alert('Invalid file format. Please upload a file with the correct headers.');
        (event.target as HTMLInputElement).value = '';
        return false;
      }

      console.log('Parsed data:', results.data);
      if (/[A]/.test(file.name)){
        GlResult = results;
      }else{
        GlSecondResult = results;
      }
    },
  })
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    console.error('No file selected');
    return;
  }
  fileName = file.name;
  fileReader(file, event);
}

function handleSecondFileChange(event: Event) {
  const file2 = (event.target as HTMLInputElement).files?.[0];
  if (!file2) {
    console.error('No second file selected');
    return;
  }
  secondFileName = file2.name;
  fileReader(file2, event);
}

function handleFormSubmit() {
  if (!GlResult || !GlSecondResult) {
    console.error('No files parsed yet');
    alert('Please upload both files before submitting.');
    return;
  }
  if (fileName === secondFileName) {
    console.error('Files must be different');
    alert('Files must be different. Please select two different files.');
    return;
  }
  console.log('First result',GlResult);
  console.log('Second result',GlSecondResult);
  console.log('id from first file:', GlResult.data.map((row: any) => row.id));
  console.log('id from second file:', GlSecondResult.data.map((row: any) => row.id));

  if (IdCheck() === false) {
    return;
  }
  const isFirstValid = GlResult.data.every(validateType);
  const isSecondValid = GlSecondResult.data.every(validateType);
  if (!isFirstValid || !isSecondValid) {
    console.error('Invalid data in one or both files');
    alert('Invalid data in one or both files. Please check the format and content.');
    return;
  }

  const mergedData = [...GlResult.data, ...GlSecondResult.data];

  upload(mergedData)
  console.log('Form submitted');
}

async function upload(data: any) { 
  await $fetch('/api/upload', {
    method: 'POST',
    body: { data: data },
  });
}

function validateType(row: any){
  const namePattern = /^Item_\d+$/.test(row.name);
  const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(row.date);
  const isValue1 = !isNaN(Number(row.value1));
  const isValue2 = !isNaN(Number(row.value2));
  const statusPattern = /^(active|inactive|pending)$/.test(row.status);
  // console.log('Row validation:', row);
  // console.log('Name pattern:', namePattern);
  // console.log('Date pattern:', datePattern);
  // console.log('Value1 is a number:', isValue1);
  // console.log('Value2 is a number:', isValue2);
  // console.log('Status pattern:', statusPattern);
  return (
    namePattern &&
    datePattern &&
    isValue1 &&
    isValue2 &&
    statusPattern
  );
}

function IdCheck(){
  const firstIds = new Set(GlResult.data.map((row: any) => row.id));
  const secondIds = new Set(GlSecondResult.data.map((row: any) => row.id));

  const commonIds = Array.from(firstIds).filter(id => secondIds.has(id));
  if (commonIds.length === firstIds.size && commonIds.length === secondIds.size) {
    console.log('All IDs match between the two files.');
  } else {
    console.error('ID mismatch found between the two files.');
    alert('ID mismatch found. Please check your files.');
    return false;
  }
}

</script>

<style module>
  @import url('~/assets/css/main.css');
</style>
